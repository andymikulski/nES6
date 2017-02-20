'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rusha = require('rusha');

var _rusha2 = _interopRequireDefault(_rusha);

var _consts = require('../config/consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestRenderSurface = function () {
	function TestRenderSurface(canvasParent) {
		_classCallCheck(this, TestRenderSurface);

		this._buffer = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
	}

	_createClass(TestRenderSurface, [{
		key: 'writeToBuffer',
		value: function writeToBuffer(bufferIndex, insertIndex, colour) {
			this._buffer[insertIndex] = 0xFF000000 | colour;
		}
	}, {
		key: 'clearBuffers',
		value: function clearBuffers(backgroundColour) {
			for (var i = 0; i < this._buffer.length; ++i) {
				this._buffer[i] = 0xFF000000 | backgroundColour;
			}
		}
	}, {
		key: 'getRenderBufferHash',
		value: function getRenderBufferHash() {
			var rusha = new _rusha2.default();
			return rusha.digestFromArrayBuffer(this._buffer).toUpperCase();
		}
	}]);

	return TestRenderSurface;
}();

exports.default = TestRenderSurface;