'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebAudioBuffer = function () {
	function WebAudioBuffer(audioContext, masterVolNode, size) {
		_classCallCheck(this, WebAudioBuffer);

		this._locked = false;
		this.audioContext = audioContext;

		this.audioNode = null;
		this._gainNode = this.audioContext['createGain']();
		this._gainNode['connect'](masterVolNode);

		this.audioBuffer = this.audioContext['createBuffer'](1, size, this.audioContext['sampleRate']);
	}

	_createClass(WebAudioBuffer, [{
		key: 'lockBuffer',
		value: function lockBuffer() {
			this._locked = true;
			return this.audioBuffer['getChannelData'](0);
		}
	}, {
		key: 'unlockBuffer',
		value: function unlockBuffer() {
			this._locked = false;

			// Alternative method using audio node buffer instead of onaudioprocess
			if (this.audioNode) {
				this.audioNode['disconnect']();
				this.audioNode = null;
			}
			this.audioNode = this.audioContext['createBufferSource']();
			this.audioNode['buffer'] = this.audioBuffer;

			this.audioNode['connect'](this._gainNode);
			this.audioNode['start'](0);
		}
	}]);

	return WebAudioBuffer;
}();

exports.default = WebAudioBuffer;