'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('../../config/consts');

var _fileSaver = require('file-saver');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Must be power of 2
var TEXTURE_WIDTH = 256;
var TEXTURE_HEIGHT = 256;

var WebGlRenderSurface = function () {
	function WebGlRenderSurface(canvasParent) {
		var _this = this;

		_classCallCheck(this, WebGlRenderSurface);

		this._ready = false;

		this._clearArray = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._offscreen32BitView = new Uint32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
		this._offscreen8BitView = new Uint8Array(this._offscreen32BitView.buffer);

		this._element = canvasParent.getCanvasElement();
		this._glContext = (0, _utils.getGlContext)(this._element);

		this._camera = new _utils.OrthoCamera(this._glContext);
		this._camera.setup(_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);

		this._initBuffers();

		this._texture = new _utils.FillableTexture(this._glContext, TEXTURE_WIDTH, TEXTURE_HEIGHT);

		canvasParent.connect('resize', this._onResize.bind(this));

		this._inputSizeShaderArray = new Float32Array([_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT]);
		this._outputSizeShaderArray = new Float32Array([_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT]);
		this._textureSizeShaderArray = new Float32Array([TEXTURE_WIDTH, TEXTURE_HEIGHT]);

		this._shader = new _utils.ShaderProgram(this._glContext);

		this.loadShader(null, function () {
			_this._ready = true;
		});
	}

	_createClass(WebGlRenderSurface, [{
		key: 'loadShader',
		value: function loadShader(shaderFilename, callback) {

			var that = this;
			this._shader.loadAndLink(shaderFilename, function () {
				that._shader.use();

				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyInputSize"), that._inputSizeShaderArray);
				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyOutputSize"), that._outputSizeShaderArray);
				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyTextureSize"), that._textureSizeShaderArray);

				that._glContext.uniformMatrix4fv(that._shader.getUniformLocation("aModelViewProjectionMatrix"), false, that._camera.getMVPMatrix());

				that._vertexBuffer.bind(that._shader.getAttrib("aVertexPosition"));
				that._textureCoordBuffer.bind(that._shader.getAttrib("aTextureCoord"));
				that._indexBuffer.bind();
				that._texture.bind();

				that._glContext.uniform1i(that._shader.getUniformLocation("rubyTexture"), 0); //Texture unit 0 is for base images.

				callback();
			});
		}
	}, {
		key: '_initBuffers',
		value: function _initBuffers() {
			var t = _consts.SCREEN_WIDTH / TEXTURE_WIDTH;
			var u = _consts.SCREEN_HEIGHT / TEXTURE_HEIGHT;

			var vertices = new Float32Array([0, 0, 0.0, 1.0, _consts.SCREEN_WIDTH, 0, 0.0, 1.0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT, 0.0, 1.0, 0, _consts.SCREEN_HEIGHT, 0.0, 1.0]);
			var texCoords = new Float32Array([0.0, 0.0, t, 0.0, t, u, 0.0, u]);
			var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

			this._vertexBuffer = new _utils.VertexBuffer(this._glContext);
			this._vertexBuffer.setData(vertices, 4, 4);

			this._textureCoordBuffer = new _utils.VertexBuffer(this._glContext);
			this._textureCoordBuffer.setData(texCoords, 2, 4);

			this._indexBuffer = new _utils.IndexBuffer(this._glContext);
			this._indexBuffer.setData(indices, 6);
		}
	}, {
		key: '_onResize',
		value: function _onResize() {
			this._glContext.viewport(0, 0, this._element.width, this._element.height);
			this._glContext.clearColor(0.0, 0.0, 0.0, 1.0);
		}
	}, {
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

			// update clear array if background colour changes
			if (backgroundColour !== this._clearArrayColour) {
				for (var i = 0; i < this._clearArray.length; ++i) {
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

			if (!this._ready) {
				return;
			}
			this._glContext.clear(this._glContext.COLOR_BUFFER_BIT);
			this._texture.fill(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT, this._offscreen8BitView);
			this._glContext.uniform1i(this._shader.getUniformLocation("rubyFrameCount"), mainboard.ppu.frameCounter);
			this._indexBuffer.draw();
		}
	}, {
		key: '_createCanvasWithScreenshotOn',
		value: function _createCanvasWithScreenshotOn() {

			// create copy of offscreen buffer into a new canvas element
			var element = document.createElement('canvas');
			element.width = _consts.SCREEN_WIDTH;
			element.height = _consts.SCREEN_HEIGHT;
			var canvas = element.getContext("2d");
			var imgData = canvas.getImageData(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);
			imgData.data.set(this._offscreen8BitView.subarray(0, _consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT * 4));
			canvas.putImageData(imgData, 0, 0);
			return element;
		}
	}, {
		key: 'screenshotToFile',
		value: function screenshotToFile() {
			var element = this._createCanvasWithScreenshotOn();
			element.toBlob(function (blob) {
				(0, _fileSaver.saveAs)(blob, "screenshot.png");
			});
		}
	}, {
		key: 'screenshotToString',
		value: function screenshotToString() {
			var element = this._createCanvasWithScreenshotOn();
			return element.toDataURL("image/png");
		}
	}, {
		key: 'loadShaderFromUrl',
		value: function loadShaderFromUrl(url) {
			this.loadShader(url, function () {});
		}
	}]);

	return WebGlRenderSurface;
}();

exports.default = WebGlRenderSurface;