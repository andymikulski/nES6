'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fileSaver = require('file-saver');

var _consts = require('../../config/consts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderSurface = function () {
	function CanvasRenderSurface(canvasParent) {
		_classCallCheck(this, CanvasRenderSurface);

		this._clearArray = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);

		this._offscreenElement = document.createElement('canvas');
		this._offscreenElement.width = _consts.SCREEN_WIDTH;
		this._offscreenElement.height = _consts.SCREEN_HEIGHT;
		this._offscreenCanvas = this._offscreenElement.getContext("2d");
		//this._offscreenCanvas.imageSmoothingEnabled = false;
		this._offscreenData = this._offscreenCanvas.getImageData(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);

		if (!this._offscreenData.data.buffer) {
			throw new Error("Browser does not support canvas image buffers. Cannot run emulator");
		}
		// Chrome & Firefox support passing the underlying image data buffer to Uint32Array(). IE does not.
		this._offscreen32BitView = new Uint32Array(this._offscreenData.data.buffer);
		if (this._offscreen32BitView.length !== this._clearArray.length) {
			throw new Error("Unexpected canvas buffer size (actual=" + this._offscreen32BitView.length + ")");
		}

		this._element = canvasParent.getCanvasElement();
		this._canvas = this._element.getContext("2d");
		//this._canvas.imageSmoothingEnabled = false;
	}

	_createClass(CanvasRenderSurface, [{
		key: 'writeToBuffer',
		value: function writeToBuffer(bufferIndex, insertIndex, colour) {
			var existingIndex = this._bufferIndexArray[insertIndex];
			if (existingIndex <= bufferIndex) {
				this._offscreen32BitView[insertIndex] = 0xFF000000 | colour;
				this._bufferIndexArray[insertIndex] = bufferIndex;
			}
		}
	}, {
		key: 'getRenderBufferHash',
		value: function getRenderBufferHash() {

			var rusha = new Rusha();
			return rusha.digestFromArrayBuffer(this._offscreen32BitView).toUpperCase();
		}
	}, {
		key: 'clearBuffers',
		value: function clearBuffers(backgroundColour) {

			var i = 0;
			// update clear array if background colour changes
			if (backgroundColour !== this._clearArrayColour) {
				for (i = 0; i < this._clearArray.length; ++i) {
					this._clearArray[i] = 0xFF000000 | backgroundColour;
				}
				this._clearArrayColour = backgroundColour;
			}

			// set background colour
			this._offscreen32BitView.set(this._clearArray);

			// Nes.ClearScreenArray is a quicker way of clearing this array
			this._bufferIndexArray.set(_consts.g_ClearScreenArray);
		}
	}, {
		key: 'render',
		value: function render(mainboard) {

			this._offscreenCanvas.putImageData(this._offscreenData, 0, 0);
			// Draw offscreen canvas onto front buffer, resizing it in the process
			this._canvas.drawImage(this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight);
		}
	}, {
		key: 'screenshotToFile',
		value: function screenshotToFile() {

			this._offscreenElement.toBlob(function (blob) {
				(0, _fileSaver.saveAs)(blob, "screenshot.png");
			});
		}
	}, {
		key: 'screenshotToString',
		value: function screenshotToString() {

			return this._offscreenElement.toDataURL("image/png");
		}
	}]);

	return CanvasRenderSurface;
}();

exports.default = CanvasRenderSurface;