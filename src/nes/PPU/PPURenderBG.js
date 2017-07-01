import { writeLine, trace_ppu } from '../../utils/Trace';

import {
	MASTER_CYCLES_PER_PPU,
	MASTER_CYCLES_PER_SCANLINE,
	SCREEN_HEIGHT,
	SCREEN_WIDTH,
} from '../../config/consts';

// consts use by renderPartialScanline
const ScrollReloadTime = 304; // pre-render SL only
const XReloadTime = 257;
const SecondLastTileReloadTime = 324;
const LastTileReloadTime = 332;

const ticksPerTile = 8;
const ticksFirstTile = 3;
const ticksLastTile = ticksFirstTile + (31 * ticksPerTile);

const YIncrementTime = 251;
const YIncrementTimeRendering = (YIncrementTime + 17) * MASTER_CYCLES_PER_PPU;
const XReloadTimeRendering = (XReloadTime + 17) * MASTER_CYCLES_PER_PPU;

let backgroundRenderingStart = 0;
let backgroundRenderingEnd = 0;
let backgroundScrollReloadTime = 0;
const backgroundTileCount = 34;


export default class PPURenderBG {
  constructor(ppu) {
    this.ppu = ppu;
    this._spriteZeroHit = false;
    this._useMMC2Latch = false;
  }

  reset() {
    backgroundRenderingStart = this.ppu.screenCoordinatesToTicks(ScrollReloadTime - 1, -1);
    backgroundRenderingEnd = this.ppu.screenCoordinatesToTicks(SecondLastTileReloadTime - 1, 239);
    backgroundScrollReloadTime = this.ppu.screenCoordinatesToTicks(ScrollReloadTime, -1);

    this._bgTableAddress = 0;
    this._spriteZeroHit = false;
    this._renderBuffer = this.ppu.mainboard.renderBuffer;
    this._useMMC2Latch = this.ppu.mainboard.cart.memoryMapper.MMC2Latch !== undefined;
  }


  onControl1Change(control1) {
    this._bgTableAddress = (control1 & 0x10) > 0 ? 0x1000 : 0;
  }


  onEndFrame() {
    this._spriteZeroHit = false;
  }


  saveState(data) {
    data._spriteZeroHit = this._spriteZeroHit;
  }


  loadState(state) {
    this._spriteZeroHit = state._spriteZeroHit;
  }


  _renderTile(ppuReadAddress, tilenum, posy, clippingEnabled) {
    let triggerTime = 0;
    const renderScanline = posy | 0; // ( tilenum <= 2 ? posy + 1 : posy );
    const startXRendering = clippingEnabled ? 8 : 0;
    const baseindex = (tilenum | 0) * 8;

    const htile = (ppuReadAddress & 0x001F);
    const vtile = (ppuReadAddress & 0x03E0) >> 5;
		// var finey = ((this.ppu.ppuReadAddress & 0x7000) >> 12);

    const nameTableAddress = (0x2000 + (ppuReadAddress & 0x0FFF)) & 0xFFFF;
    const tileNumber = this.ppu.readNameTable(nameTableAddress, 0);

		// (screen address) + (tilenumber * 16) + finey
    const tileAddress = this._bgTableAddress + tileNumber * 16 + ((ppuReadAddress & 0x7000) >> 12);
    const attributeByte = this.ppu.readNameTable(0x23C0 | (ppuReadAddress & 0x0C00) | ((vtile & 0x1C) << 1) | ((htile >> 2) & 0x7), 1);

    let mergeByte = 0;
    if ((htile & 0x2) === 0) {
      if ((vtile & 0x2) === 0) {
        mergeByte = (attributeByte & 0x3) << 2;
      } else {
        mergeByte = (attributeByte & 0x30) >> 2;
      }
    } else if ((vtile & 0x2) === 0) {
      mergeByte = (attributeByte & 0xC);
    } else {
      mergeByte = (attributeByte & 0xC0) >> 4;
    }

		// pattern table reads
    const firstByte = this.ppu.read8(tileAddress, false, 2);
    const secondByte = this.ppu.read8(tileAddress + 8, false, 3);

    if (this._useMMC2Latch) {
      this.ppu.mainboard.cart.memoryMapper.MMC2Latch(tileAddress + 8);
    }

		// render tiles from right-most pixel first - allows us to shift the first & second pattern table byte to get the palette
		// index we want.

    const startPixel = baseindex - this.ppu.fineX;
    const endPixel = startPixel + 7;
    const realStartPixel = Math.max(startPixel, 0);
    const startPixelIndex = realStartPixel - startPixel;
    let paletteIndex = 0;
    let byteMask = 0x80 >> startPixelIndex;
    let x = realStartPixel;
    for (; x <= endPixel; ++x) {
      paletteIndex = (firstByte & byteMask) > 0 ? 0x1 : 0;
      paletteIndex |= (secondByte & byteMask) > 0 ? 0x2 : 0;

      byteMask >>= 1;

      if (x >= startXRendering && x < SCREEN_WIDTH) {
        if (paletteIndex > 0) {
          paletteIndex |= mergeByte;

          if ((paletteIndex & 0x3) === 0) { paletteIndex = 0; }

          if (this._renderBuffer.renderPixel(x, renderScanline, this.ppu.paletteTables[0][paletteIndex & 0xF] | 0)) {
									// Sprite zero hit - will happen in the future as this is the prefetch
            if (!this._spriteZeroHit) {
              triggerTime = this.ppu.screenCoordinatesToTicks(x, renderScanline);
              writeLine(trace_ppu, `[${this.ppu.frameCounter}] PPU sprite hit scheduled for @ ${x}x${renderScanline} (${triggerTime})`);
              this._spriteZeroHit = true;
              this.ppu.mainboard.synchroniser.changeEventTime(this.ppu._spriteZeroEventId, triggerTime);
            }
          }
        }
      }
    }
  }


  _incrementY(ppuReadAddress) {
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
			// ppuReadAddress &= ~0x7000;
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


  _incrementX(ppuReadAddress) {
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
      ppuReadAddress = (ppuReadAddress + 1) & 0xFFFF;
    }
    return ppuReadAddress;
  }


  renderTo(startTicks, endTicks, ppuReadAddress, ppuLatchAddress) {
    writeLine(trace_ppu, `sync: startTicks=${startTicks} endTicks=${endTicks}`);

    let ticksInFirstLine = 0;
    let ticksAtFirstScanline = 0;
    let tileTickPosition = 0;
    let tilenum = 0;
    let ticksAtFirstRenderingScanline = 0;
    let ticksAtFirstRenderingScanlineEnd = 0;
    let scanlineStart = 0;
    const posy = 0;
    const clippingEnabled = (this.ppu.control2 & 0x2) === 0;
    const backgroundRenderingEnabled = (this.ppu.control2 & 0x8) > 0;
    let reloadTime = 0;
    let incrementYTime = 0;
    let scanline = 0;

    if (startTicks < backgroundRenderingStart) {
      startTicks = backgroundRenderingStart;
    }
    if (endTicks > backgroundRenderingEnd) {
      endTicks = backgroundRenderingEnd;
    }
    if (endTicks <= startTicks) {
      return ppuReadAddress;
    }

    ticksInFirstLine = (startTicks % MASTER_CYCLES_PER_SCANLINE);
    ticksAtFirstScanline = startTicks - ticksInFirstLine;
    ticksAtFirstRenderingScanline = ticksAtFirstScanline - MASTER_CYCLES_PER_SCANLINE + (SecondLastTileReloadTime * MASTER_CYCLES_PER_PPU);
    ticksAtFirstRenderingScanlineEnd = ticksAtFirstRenderingScanline + MASTER_CYCLES_PER_SCANLINE; // ( 34 * 8 * MASTER_CYCLES_PER_PPU );

    while (ticksAtFirstRenderingScanlineEnd < startTicks || ticksAtFirstRenderingScanline < backgroundRenderingStart) {
      ticksAtFirstRenderingScanline += MASTER_CYCLES_PER_SCANLINE;
      ticksAtFirstRenderingScanlineEnd += MASTER_CYCLES_PER_SCANLINE;
    }

    if (backgroundScrollReloadTime > startTicks && backgroundScrollReloadTime <= endTicks) {
			// reset ppu address on cycle 304 of pre-render scanline
      ppuReadAddress = (ppuReadAddress & 0x41F) | (ppuLatchAddress & 0x7BE0);
    }

    scanlineStart = ticksAtFirstRenderingScanline;
    scanline = (Math.floor((ticksAtFirstRenderingScanline - backgroundRenderingStart) / MASTER_CYCLES_PER_SCANLINE)) | 0;


		// tile prefetches between SecondLastTileReloadTime (previous line) for 34 tiles
    while (scanlineStart <= endTicks) {
      incrementYTime = scanlineStart + YIncrementTimeRendering;
      reloadTime = scanlineStart + XReloadTimeRendering;

      for (tilenum = 0; tilenum < backgroundTileCount; ++tilenum) {
        tileTickPosition = scanlineStart + (tilenum * 8 * MASTER_CYCLES_PER_PPU);

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
        ppuReadAddress = (ppuReadAddress & 0xFBE0) | (ppuLatchAddress & 0x041F);
      }

      scanlineStart += MASTER_CYCLES_PER_SCANLINE;
      scanline++;
    }
    return ppuReadAddress;
  }
}
