'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = require('./BaseMapper.js');

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

var _consts = require('../../config/consts.js');

var _serialisation = require('../../utils/serialisation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper9 = function (_BaseMapper) {
	_inherits(Mapper9, _BaseMapper);

	function Mapper9() {
		_classCallCheck(this, Mapper9);

		return _possibleConstructorReturn(this, (Mapper9.__proto__ || Object.getPrototypeOf(Mapper9)).apply(this, arguments));
	}

	_createClass(Mapper9, [{
		key: 'init',
		value: function init() {
			this._banks = new Int32Array(4);
		}
	}, {
		key: 'mapperSaveState',
		value: function mapperSaveState(state) {

			state._banks = Nes.uintArrayToString(this._banks);
			state._latches = this._latches.slice(0);
		}
	}, {
		key: 'mapperLoadState',
		value: function mapperLoadState(state) {

			this._banks = Nes.stringToUintArray(state._banks);
			this._latches = state._latches.slice(0);
		}
	}, {
		key: 'reset',
		value: function reset() {

			this._latches = [true, false];
			for (var i = 0; i < this._banks.length; ++i) {
				this._banks[i] = 0;
			}

			this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
			for (var i = 0; i < 8; ++i) {
				this.switch1kChrBank(0, i);
			}
			//	this.switch8kChrBank( 0 );
			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}, {
		key: '_syncChrBanks',
		value: function _syncChrBanks(performSync) {

			if (performSync === undefined ? true : performSync) {
				this.mainboard.synchroniser.synchronise();
			}
			var lowerBankId = this._latches[0] ? 1 : 0;
			this.switch4kChrBank(this._banks[lowerBankId], true);
			var upperBankId = this._latches[1] ? 3 : 2;
			this.switch4kChrBank(this._banks[upperBankId], false);
		}
	}, {
		key: 'MMC2Latch',
		value: function MMC2Latch(ppuReadAddress) {

			// http://wiki.nesdev.com/w/index.php/MMC2
			if (ppuReadAddress === 0xFD8) {
				this._latches[0] = false;
				this._syncChrBanks(false);
			} else if (ppuReadAddress === 0xFE8) {
				this._latches[0] = true;
				this._syncChrBanks(false);
			} else if (ppuReadAddress >= 0x1FD8 && ppuReadAddress <= 0x1FDF) {
				this._latches[1] = false;
				this._syncChrBanks(false);
			} else if (ppuReadAddress >= 0x1FE8 && ppuReadAddress <= 0x1FEF) {
				this._latches[1] = true;
				this._syncChrBanks(false);
			}
			// var latchId = ( ppuReadAddress & 0x1000 ) > 0 ? 1 : 0;
			// var tilenum = ( ppuReadAddress >> 4 ) & 0xFF;
			// var isFE = tilenum === 0xFE;
			// if ( tilenum === 0xFD || isFE ) {
			// this._latches[ latchId ] = isFE;
			// this._syncChrBanks();
			// }
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {

			var top4Bits = offset & 0xF000;
			switch (top4Bits) {
				case 0xA000:
					this.mainboard.synchroniser.synchronise();
					this.switch8kPrgBank(data & 0xf, 0);
					break;
				case 0xB000:
					this._banks[0] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xC000:
					this._banks[1] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xD000:
					this._banks[2] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xE000:
					this._banks[3] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xF000:
					this.mainboard.synchroniser.synchronise();
					this.mainboard.ppu.changeMirroringMethod((data & 0x1) > 0 ? _consts.PPU_MIRRORING_HORIZONTAL : _consts.PPU_MIRRORING_VERTICAL);
					break;
				default:
					Nes.basemapper.prototype.write8PrgRom.call(this, offset, data);
					break;
			}
		}
	}]);

	return Mapper9;
}(_BaseMapper3.default);

exports.default = Mapper9;