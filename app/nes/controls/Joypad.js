"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Joypad = function () {
  function Joypad() {
    _classCallCheck(this, Joypad);

    this._currentState = 0;
    this._strobedState = 0;
    this._strobeByte = 0;
    this._readCount = 0;
  }

  _createClass(Joypad, [{
    key: "writeToRegister",
    value: function writeToRegister(offset, data) {
      var firstBit = data & 1;
      if (this._strobeByte === 1 || firstBit === 1) {
        this._strobeByte = firstBit | 0;
        this._strobedState = this._currentState;
        this._readCount = 0;
      }
    }
  }, {
    key: "readFromRegister",
    value: function readFromRegister(offset) {

      var ret = 0;
      if (this._strobeByte === 1) {
        this._strobedState = this._currentState;
        this._readCount = 0;
        ret = this._strobedState & 1 | 0;
      } else {
        ret = this._strobedState >> this._readCount & 1 | 0;
        this._readCount++;
        ret |= 0x40;
      }
      return ret | 0;
    }
  }, {
    key: "_getDuplicateMask",
    value: function _getDuplicateMask(buttonIndex) {

      // disallow pressing up+down and left+right at the same time - always keep the button that is already pressed
      switch (buttonIndex) {
        case 4:
          // UP
          return 0xDF; // ~( 0x20 );
        case 5:
          // DOWN
          return 0xEF; // ~( 0x10 );
        case 6:
          // LEFT
          return 0x7F; // ~( 0x80 );
        case 7:
          // RIGHT
          return 0xBF; // ~( 0x40 );
      }
      return 0xFF;
    }
  }, {
    key: "pressButton",
    value: function pressButton(buttonIndex, pressed) {

      if (pressed) {
        this._currentState |= 1 << buttonIndex;
        this._currentState &= this._getDuplicateMask(buttonIndex); // this prevents up+down and left+right being pressed
      } else {
        this._currentState &= 0xFF ^ 1 << buttonIndex;
      }
    }
  }, {
    key: "saveState",
    value: function saveState() {
      return {
        _currentState: this._currentState,
        _strobedState: this._strobedState,
        _strobeByte: this._strobeByte,
        _readCount: this._readCount
      };
    }
  }, {
    key: "loadState",
    value: function loadState(state) {
      this._currentState = state._currentState;
      this._strobedState = state._strobedState;
      this._readCount = state._readCount;
      this._strobeByte = state._strobeByte;
    }
  }]);

  return Joypad;
}();

exports.default = Joypad;