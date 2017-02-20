'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Joypad = require('./Joypad');

var _Joypad2 = _interopRequireDefault(_Joypad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputDeviceBus = function () {
  function InputDeviceBus() {
    _classCallCheck(this, InputDeviceBus);

    this.j1 = new _Joypad2.default();
    this.j2 = new _Joypad2.default();
  }

  _createClass(InputDeviceBus, [{
    key: 'getJoypad',
    value: function getJoypad(index) {
      switch (index) {
        case 0:
          return this.j1;
        case 1:
          return this.j2;
        default:
          return null;
      }
    }
  }, {
    key: 'writeToRegister',
    value: function writeToRegister(offset, data) {
      switch (offset) {
        case 0x4016:
          this.j1.writeToRegister(offset, data);
          break;
        case 0x4017:
          this.j2.writeToRegister(offset, data);
          break;
      }
    }
  }, {
    key: 'readFromRegister',
    value: function readFromRegister(offset) {
      var ret = 0;
      switch (offset) {
        case 0x4016:
          ret = this.j1.readFromRegister(offset) | 0;
          break;
        case 0x4017:
          ret = this.j2.readFromRegister(offset) | 0;
          break;
      }
      return ret;
    }
  }]);

  return InputDeviceBus;
}();

exports.default = InputDeviceBus;