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

var Mapper0 = function (_BaseMapper) {
	_inherits(Mapper0, _BaseMapper);

	function Mapper0() {
		_classCallCheck(this, Mapper0);

		return _possibleConstructorReturn(this, (Mapper0.__proto__ || Object.getPrototypeOf(Mapper0)).apply(this, arguments));
	}

	_createClass(Mapper0, [{
		key: 'reset',
		value: function reset() {
			if (this.get32kPrgBankCount() >= 1) {
				this.switch32kPrgBank(0);
			} else if (this.get16kPrgBankCount() == 1) {
				this.switch16kPrgBank(0, true);
				this.switch16kPrgBank(0, false);
			}

			if (this.get1kChrBankCount() === 0) {
				this.useVRAM();
			} else {
				this.switch8kChrBank(0);
			}

			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}]);

	return Mapper0;
}(_BaseMapper3.default);

exports.default = Mapper0;