'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serialisation = require('../utils/serialisation');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Memory = function () {
	function Memory(mainboard) {
		_classCallCheck(this, Memory);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.ramPage = new Int32Array(0x800);
		this.gppu = null;
		this.gmapper = null;
		this.ginput = null;
		this.gapu = null;
	}

	_createClass(Memory, [{
		key: 'reset',
		value: function reset(cold) {
			if (cold) {
				// these memory locations are set to various values on power-up
				for (var i = 0; i < this.ramPage.length; ++i) {
					this.ramPage[i] = 0xFF;
				}
				this.ramPage[0x0008] = 0xF7;
				this.ramPage[0x0009] = 0xEF;
				this.ramPage[0x000a] = 0xDF;
				this.ramPage[0x000f] = 0xBF;
			}
			this.gppu = this.mainboard.ppu;
			this.gmapper = this.mainboard.cart.memoryMapper;
			this.ginput = this.mainboard.inputdevicebus;
			this.gapu = this.mainboard.apu;
		}
	}, {
		key: 'read8',
		value: function read8(offset) {
			return this._properRead8(offset & 0xFFFF) & 0xFF;
		}
	}, {
		key: '_readRegister4000',
		value: function _readRegister4000(offset) {
			var offset4000 = offset & 0x1FE0;
			if (offset4000 === 0) {
				// testing top 11 bits - if it's zero it's between 4000 -> 4020
				if (offset === 0x4016 || offset === 0x4017) {
					//				return 0;
					return this.ginput.readFromRegister(offset);
				} else {
					return 0;
					//			return gapu.readFromRegister( offset ) | 0;
				}
			} else {
				return this.gmapper.read8EXRam(offset);
				//			return 0;
			}
			return 0;
		}
	}, {
		key: '_properRead8',
		value: function _properRead8(offset) {
			// Faster: Top 3 bits are equal to 0x2000 for inbetween 2000 -> 4000, equal to 0 for < 2000 and so on
			var topbits = offset & 0xE000;
			var bot3 = offset & 0x7;
			var rampageOffset = offset & 0x7FF;
			switch (topbits) {
				case 0:
					// address is within RAM boundaries, account for 4x mirroring
					return this.ramPage[rampageOffset];
				case 0x2000:
					// IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
					return this.gppu.readFromRegister(bot3);
				case 0x4000:
					return this._readRegister4000(offset);
				case 0x6000:
					// IS_INT_BETWEEN( offset, 0x6000, 0x8000 )
					return this.gmapper.read8SRam(offset);
				default:
					// IS_INT_BETWEEN( offset, 0x8000, 0x10000 )
					return this.gmapper.read8PrgRom(offset);
			}
			return 0;
		}
	}, {
		key: 'read16NoZeroPageWrap',
		value: function read16NoZeroPageWrap(offset) {
			return this.read8(offset) | this.read8(offset + 1) << 8;
		}
	}, {
		key: 'write8',
		value: function write8(offset, data) {
			switch (offset & 0xE000) {
				case 0:
					// IS_INT_BETWEEN( offset, 0, 0x2000 ) address is within RAM boundaries, account for 4x mirroring
					this.ramPage[offset & 0x7FF] = data;
					break;
				case 0x2000:
					// IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
					this.mainboard.ppu.writeToRegister(offset & 0x07, data);
					break;
				case 0x4000:
					{
						if ((offset & 0x1FE0) === 0) {
							// testing top 11 bits - if it's zero it's between 4000 -> 4020
							switch (offset) {
								case 0x4014:
									// sprite DMA access
									this.mainboard.ppu.writeToSpriteDMARegister(data);
									break;
								case 0x4016: // input
								case 0x4017:
									this.mainboard.inputdevicebus.writeToRegister(offset, data);
									break;
							}
							// APU (write input 4016 + 4017 to APU as well) <-- is that right??
							this.mainboard.apu.writeToRegister(offset, data);
						} else {
							// IS_INT_BETWEEN( offset, 0x4020, 0x6000 )
							this.mainboard.cart.memoryMapper.write8EXRam(offset, data);
						}
					}
					break;
				case 0x6000:
					// IS_INT_BETWEEN( offset, 0x6000, 0x8000 )
					this.mainboard.cart.memoryMapper.write8SRam(offset, data);
					break;
				default:
				case 0x8000:
					// IS_INT_BETWEEN( offset, 0x8000, 0x10000 )
					this.mainboard.cart.memoryMapper.write8PrgRom(offset, data);
					break;
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			return {
				ramPage: (0, _serialisation.uintArrayToString)(this.ramPage)
			};
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.ramPage = (0, _serialisation.stringToUintArray)(state.ramPage);
		}
	}]);

	return Memory;
}();

exports.default = Memory;