'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Trace = require('../../utils/Trace');

var _consts = require('../../config/consts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// consts use by renderPartialScanline
var ScrollReloadTime = 304; // pre-render SL only
var XReloadTime = 257;
var SecondLastTileReloadTime = 324;
var LastTileReloadTime = 332;

var ticksPerTile = 8;
var ticksFirstTile = 3;
var ticksLastTile = ticksFirstTile + 31 * ticksPerTile;

var YIncrementTime = 251;
var YIncrementTimeRendering = (YIncrementTime + 17) * _consts.MASTER_CYCLES_PER_PPU;
var XReloadTimeRendering = (XReloadTime + 17) * _consts.MASTER_CYCLES_PER_PPU;

var backgroundRenderingStart = 0;
var backgroundRenderingEnd = 0;
var backgroundScrollReloadTime = 0;
var backgroundTileCount = 34;

var PPURenderBG = function () {
	function PPURenderBG(ppu) {
		_classCallCheck(this, PPURenderBG);

		this.ppu = ppu;
		this._spriteZeroHit = false;
		this._useMMC2Latch = false;
	}

	_createClass(PPURenderBG, [{
		key: 'reset',
		value: function reset() {
			backgroundRenderingStart = this.ppu.screenCoordinatesToTicks(ScrollReloadTime - 1, -1);
			backgroundRenderingEnd = this.ppu.screenCoordinatesToTicks(SecondLastTileReloadTime - 1, 239);
			backgroundScrollReloadTime = this.ppu.screenCoordinatesToTicks(ScrollReloadTime, -1);

			this._bgTableAddress = 0;
			this._spriteZeroHit = false;
			this._renderBuffer = this.ppu.mainboard.renderBuffer;
			this._useMMC2Latch = this.ppu.mainboard.cart.memoryMapper.MMC2Latch !== undefined;
		}
	}, {
		key: 'onControl1Change',
		value: function onControl1Change(control1) {
			this._bgTableAddress = (control1 & 0x10) > 0 ? 0x1000 : 0;
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {
			this._spriteZeroHit = false;
		}
	}, {
		key: 'saveState',
		value: function saveState(data) {
			data._spriteZeroHit = this._spriteZeroHit;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this._spriteZeroHit = state._spriteZeroHit;
		}
	}, {
		key: '_renderTile',
		value: function _renderTile(ppuReadAddress, tilenum, posy, clippingEnabled) {
			var triggerTime = 0;
			var renderScanline = posy | 0; // ( tilenum <= 2 ? posy + 1 : posy );
			var startXRendering = clippingEnabled ? 8 : 0;
			var baseindex = (tilenum | 0) * 8;

			var htile = ppuReadAddress & 0x001F;
			var vtile = (ppuReadAddress & 0x03E0) >> 5;
			//var finey = ((this.ppu.ppuReadAddress & 0x7000) >> 12);

			var nameTableAddress = 0x2000 + (ppuReadAddress & 0x0FFF) & 0xFFFF;
			var tileNumber = this.ppu.readNameTable(nameTableAddress, 0);

			// (screen address) + (tilenumber * 16) + finey
			var tileAddress = this._bgTableAddress + tileNumber * 16 + ((ppuReadAddress & 0x7000) >> 12);
			var attributeByte = this.ppu.readNameTable(0x23C0 | ppuReadAddress & 0x0C00 | (vtile & 0x1C) << 1 | htile >> 2 & 0x7, 1);

			var mergeByte = 0;
			if ((htile & 0x2) === 0) {
				if ((vtile & 0x2) === 0) {
					mergeByte = (attributeByte & 0x3) << 2;
				} else {
					mergeByte = (attributeByte & 0x30) >> 2;
				}
			} else {
				if ((vtile & 0x2) === 0) {
					mergeByte = attributeByte & 0xC;
				} else {
					mergeByte = (attributeByte & 0xC0) >> 4;
				}
			}

			// pattern table reads
			var firstByte = this.ppu.read8(tileAddress, false, 2);
			var secondByte = this.ppu.read8(tileAddress + 8, false, 3);

			if (this._useMMC2Latch) {
				this.ppu.mainboard.cart.memoryMapper.MMC2Latch(tileAddress + 8);
			}

			// render tiles from right-most pixel first - allows us to shift the first & second pattern table byte to get the palette
			// index we want.

			var startPixel = baseindex - this.ppu.fineX;
			var endPixel = startPixel + 7;
			var realStartPixel = Math.max(startPixel, 0);
			var startPixelIndex = realStartPixel - startPixel;
			var paletteIndex = 0;
			var byteMask = 0x80 >> startPixelIndex;
			var x = realStartPixel;
			for (; x <= endPixel; ++x) {
				paletteIndex = (firstByte & byteMask) > 0 ? 0x1 : 0;
				paletteIndex |= (secondByte & byteMask) > 0 ? 0x2 : 0;

				byteMask >>= 1;

				if (x >= startXRendering && x < _consts.SCREEN_WIDTH) {
					if (paletteIndex > 0) {
						paletteIndex |= mergeByte;

						if ((paletteIndex & 0x3) === 0) paletteIndex = 0;

						if (this._renderBuffer.renderPixel(x, renderScanline, this.ppu.paletteTables[0][paletteIndex & 0xF] | 0)) {
							// Sprite zero hit - will happen in the future as this is the prefetch
							if (!this._spriteZeroHit) {
								triggerTime = this.ppu.screenCoordinatesToTicks(x, renderScanline);
								(0, _Trace.writeLine)(_Trace.trace_ppu, "[" + this.ppu.frameCounter + "] PPU sprite hit scheduled for @ " + x + "x" + renderScanline + " (" + triggerTime + ")");
								this._spriteZeroHit = true;
								this.ppu.mainboard.synchroniser.changeEventTime(this.ppu._spriteZeroEventId, triggerTime);
							}
						}
					}
				}
			}
		}
	}, {
		key: '_incrementY',
		value: function _incrementY(ppuReadAddress) {
			/*
   	Y increment
   	At dot 256 of each scanline, fine Y is incremented, overflowing to coarse Y, and finally adjusted to wrap among the nametables vertically.
   	Bits 12-14 are fine Y. Bits 5-9 are coarse Y. Bit 11 selects the vertical nametable.
   		if ((v & 0x7000) != 0x7000)        // if fine Y < 7
   			v += 0x1000                      // increment fine Y
   		else
   			v &= ~0x7000                     // fine Y = 0
   			int y = (v & 0x03E0) >> 5        // let y = coarse Y
   			if y == 29
   				y = 0                          // coarse Y = 0
   				v ^= 0x0800                    // switch vertical nametable
   			else if y == 31
   				y = 0                          // coarse Y = 0, nametable not switched
   			else
   				y += 1                         // increment coarse Y
   			v = (v & ~0x03E0) | (y << 5)     // put coarse Y back into v
   */
			// INCREMENT Y LOGIC
			if ((ppuReadAddress & 0x7000) === 0x7000) {
				// wrap when tile y offset = 7
				//ppuReadAddress &= ~0x7000;
				ppuReadAddress &= 0x8FFF;

				if ((ppuReadAddress & 0x03E0) === 0x03A0) {
					// wrap tile y and switch name table bit 11, if tile y is 29
					ppuReadAddress ^= 0x0800;
					ppuReadAddress &= 0xFC1F;
				} else if ((ppuReadAddress & 0x03E0) === 0x03E0) {
					// wrap tile y if it is 31
					ppuReadAddress &= 0xFC1F;
				} else {
					// just increment tile y
					ppuReadAddress += 0x0020;
				}
			} else {
				// increment tile y offset
				ppuReadAddress += 0x1000;
			}
			return ppuReadAddress;
		}
	}, {
		key: '_incrementX',
		value: function _incrementX(ppuReadAddress) {
			/*
   The coarse X component of v needs to be incremented when the next tile is reached. Bits 0-4 are incremented, with overflow toggling bit 10. This means that bits 0-4 count from 0 to 31 across a single nametable, and bit 10 selects the current nametable horizontally.
   if ((v & 0x001F) == 31) // if coarse X == 31
     v &= ~0x001F          // coarse X = 0
     v ^= 0x0400           // switch horizontal nametable
   else
     v += 1                // increment coarse X
   */
			// INCREMENT X LOGIC
			if ((ppuReadAddress & 0x001F) === 0x001F) {
				// switch name tables (bit 10) and reset tile x to 0
				ppuReadAddress = (ppuReadAddress ^ 0x0400) & 0xFFE0;
			} else {
				// next tile
				ppuReadAddress = ppuReadAddress + 1 & 0xFFFF;
			}
			return ppuReadAddress;
		}
	}, {
		key: 'renderTo',
		value: function renderTo(startTicks, endTicks, ppuReadAddress, ppuLatchAddress) {
			(0, _Trace.writeLine)(_Trace.trace_ppu, 'sync: startTicks=' + startTicks + ' endTicks=' + endTicks);

			var ticksInFirstLine = 0;
			var ticksAtFirstScanline = 0;
			var tileTickPosition = 0;
			var tilenum = 0;
			var ticksAtFirstRenderingScanline = 0;
			var ticksAtFirstRenderingScanlineEnd = 0;
			var scanlineStart = 0;
			var posy = 0;
			var clippingEnabled = (this.ppu.control2 & 0x2) === 0 /*ppuControl2.backgroundClipping*/;
			var backgroundRenderingEnabled = (this.ppu.control2 & 0x8) > 0 /* ppuControl2.backgroundSwitch */;
			var reloadTime = 0;
			var incrementYTime = 0;
			var scanline = 0;

			if (startTicks < backgroundRenderingStart) {
				startTicks = backgroundRenderingStart;
			}
			if (endTicks > backgroundRenderingEnd) {
				endTicks = backgroundRenderingEnd;
			}
			if (endTicks <= startTicks) {
				return ppuReadAddress;
			}

			ticksInFirstLine = startTicks % _consts.MASTER_CYCLES_PER_SCANLINE;
			ticksAtFirstScanline = startTicks - ticksInFirstLine;
			ticksAtFirstRenderingScanline = ticksAtFirstScanline - _consts.MASTER_CYCLES_PER_SCANLINE + SecondLastTileReloadTime * _consts.MASTER_CYCLES_PER_PPU;
			ticksAtFirstRenderingScanlineEnd = ticksAtFirstRenderingScanline + _consts.MASTER_CYCLES_PER_SCANLINE; // ( 34 * 8 * MASTER_CYCLES_PER_PPU );

			while (ticksAtFirstRenderingScanlineEnd < startTicks || ticksAtFirstRenderingScanline < backgroundRenderingStart) {
				ticksAtFirstRenderingScanline += _consts.MASTER_CYCLES_PER_SCANLINE;
				ticksAtFirstRenderingScanlineEnd += _consts.MASTER_CYCLES_PER_SCANLINE;
			}

			if (backgroundScrollReloadTime > startTicks && backgroundScrollReloadTime <= endTicks) {
				// reset ppu address on cycle 304 of pre-render scanline
				ppuReadAddress = ppuReadAddress & 0x41F | ppuLatchAddress & 0x7BE0;
			}

			scanlineStart = ticksAtFirstRenderingScanline;
			scanline = Math.floor((ticksAtFirstRenderingScanline - backgroundRenderingStart) / _consts.MASTER_CYCLES_PER_SCANLINE) | 0;

			// tile prefetches between SecondLastTileReloadTime (previous line) for 34 tiles
			while (scanlineStart <= endTicks) {
				incrementYTime = scanlineStart + YIncrementTimeRendering;
				reloadTime = scanlineStart + XReloadTimeRendering;

				for (tilenum = 0; tilenum < backgroundTileCount; ++tilenum) {
					tileTickPosition = scanlineStart + tilenum * 8 * _consts.MASTER_CYCLES_PER_PPU;

					if (tileTickPosition > endTicks || tileTickPosition > backgroundRenderingEnd) {
						break;
					}
					if (tileTickPosition <= startTicks) {
						continue;
					}

					if (backgroundRenderingEnabled) {
						this._renderTile(ppuReadAddress, tilenum, scanline, clippingEnabled);
					}
					ppuReadAddress = this._incrementX(ppuReadAddress);
				}

				// render last tile on screen, increment Y
				if (incrementYTime < backgroundRenderingEnd && incrementYTime > startTicks && incrementYTime <= endTicks) {
					ppuReadAddress = this._incrementY(ppuReadAddress);
				}

				if (reloadTime < backgroundRenderingEnd && reloadTime > startTicks && reloadTime <= endTicks) {
					ppuReadAddress = ppuReadAddress & 0xFBE0 | ppuLatchAddress & 0x041F;
				}

				scanlineStart += _consts.MASTER_CYCLES_PER_SCANLINE;
				scanline++;
			}
			return ppuReadAddress;
		}
	}]);

	return PPURenderBG;
}();

exports.default = PPURenderBG;