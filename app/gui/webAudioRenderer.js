'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebAudioBuffer = require('./WebAudioBuffer.js');

var _WebAudioBuffer2 = _interopRequireDefault(_WebAudioBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebAudioRenderer = function () {
	function WebAudioRenderer(bufferSize, sampleRate) {
		_classCallCheck(this, WebAudioRenderer);

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if (window.AudioContext === undefined) {
			throw new Error("WebAudio not supported in this browser");
		}
		this.audioContext = new window.AudioContext();
		this._gainNode = this.audioContext['createGain']();
		this._gainNode['connect'](this.audioContext['destination']);
	}

	_createClass(WebAudioRenderer, [{
		key: 'setVolume',
		value: function setVolume(val) {
			if (this._gainNode) {
				this._gainNode['gain']['value'] = val / 100;
			}
		}
	}, {
		key: 'getSampleRate',
		value: function getSampleRate() {
			return this.audioContext['sampleRate'];
		}
	}, {
		key: 'createBuffer',
		value: function createBuffer(size) {
			return new _WebAudioBuffer2.default(this.audioContext, this._gainNode, size);
		}
	}]);

	return WebAudioRenderer;
}();

exports.default = WebAudioRenderer;