'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = require('./BaseMapper.js');

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper2 = function (_BaseMapper) {
	_inherits(Mapper2, _BaseMapper);

	function Mapper2() {
		_classCallCheck(this, Mapper2);

		return _possibleConstructorReturn(this, (Mapper2.__proto__ || Object.getPrototypeOf(Mapper2)).apply(this, arguments));
	}

	_createClass(Mapper2, [{
		key: 'reset',
		value: function reset() {
			this.switch16kPrgBank(0, true);
			this.switch16kPrgBank(this.get16kPrgBankCount() - 1, false);
			this.useVRAM();
			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {
			//	this.mainboard.synchroniser.synchronise();
			this.switch16kPrgBank(data, true);
		}
	}]);

	return Mapper2;
}(_BaseMapper3.default);

exports.default = Mapper2;