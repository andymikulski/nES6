'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GamePad = function () {
	function GamePad(rawPad) {
		_classCallCheck(this, GamePad);

		this._axisThreshold = 0.5;
		this._buttonStates = new Int32Array(rawPad['buttons'].length);
		this._axesStates = new Int32Array(rawPad['axes'].length);
	}

	_createClass(GamePad, [{
		key: 'getButtonCount',
		value: function getButtonCount() {
			return this._buttonStates.length;
		}

		// Returns 0 for not changed, 1 for pressed, 2 for not pressed

	}, {
		key: 'getButtonState',
		value: function getButtonState(rawPad, buttonIndex) {
			var isPressed = rawPad['buttons'][buttonIndex]['pressed'];
			var intState = isPressed ? 1 : 0;
			if (this._buttonStates[buttonIndex] !== intState) {
				this._buttonStates[buttonIndex] = intState;
				return isPressed ? 1 : 2;
			}
			return 0;
		}
	}, {
		key: 'getAxisCount',
		value: function getAxisCount() {
			return this._axesStates.length;
		}

		// Returns 0 for not changed, 1 for pressed, 2 for not pressed

	}, {
		key: 'getAxisState',
		value: function getAxisState(rawPad, axisIndex) {

			var isPressed = rawPad['axes'][axisIndex] >= this._axisThreshold || rawPad['axes'][axisIndex] <= -this._axisThreshold;
			var intState = isPressed ? 1 : 0;
			if (this._axesStates[axisIndex] !== intState) {
				this._axesStates[axisIndex] = intState;
				return isPressed ? 1 : 2;
			}
			return 0;
		}
	}]);

	return GamePad;
}();

exports.default = GamePad;