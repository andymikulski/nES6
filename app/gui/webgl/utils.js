'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.OrthoCamera = exports.FillableTexture = exports.ShaderProgram = exports.IndexBuffer = exports.VertexBuffer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getGlContext = getGlContext;
exports.webGlSupported = webGlSupported;

var _glMat = require('gl-mat4');

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultVertexShader = 'void main(void) {\n\t\t\tgl_Position = aModelViewProjectionMatrix * aVertexPosition;\n\t\t\tvTextureCoord[0] = aTextureCoord;\n\t\t}';

var defaultFragmentShader = 'uniform sampler2D rubyTexture;\n\t\tvoid main(void) {\n\t\t\tgl_FragColor = texture2D(rubyTexture, vec2(vTextureCoord[0].s, vTextureCoord[0].t));\n\t\t}';

var VertexBuffer = exports.VertexBuffer = function () {
	function VertexBuffer(glContext) {
		_classCallCheck(this, VertexBuffer);

		this._glContext = glContext;
		this._itemSize = 0;
		this._itemCount = 0;
		this._buffer = this._glContext.createBuffer();
	}

	_createClass(VertexBuffer, [{
		key: 'setData',
		value: function setData(vertices, itemSize, itemCount) {

			// ELEMENT_ARRAY_BUFFER is used by index buffer, ARRAY_BUFFER by vertex and tex coord buffers
			this._itemSize = itemSize;
			this._itemCount = itemCount;
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
			this._glContext.bufferData(this._glContext.ARRAY_BUFFER, vertices, this._glContext.STATIC_DRAW);
		}
	}, {
		key: 'bind',
		value: function bind(positionAttribute) {
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
			this._glContext.vertexAttribPointer(positionAttribute, this._itemSize, this._glContext.FLOAT, false, 0, 0);
		}
	}]);

	return VertexBuffer;
}();

var IndexBuffer = exports.IndexBuffer = function () {
	function IndexBuffer(glContext) {
		_classCallCheck(this, IndexBuffer);

		this._glContext = glContext;
		this._itemCount = 0;
		this._buffer = this._glContext.createBuffer();
	}

	_createClass(IndexBuffer, [{
		key: 'setData',
		value: function setData(indices, itemCount) {
			this._itemCount = itemCount;
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
			this._glContext.bufferData(this._glContext.ELEMENT_ARRAY_BUFFER, indices, this._glContext.STATIC_DRAW);
		}
	}, {
		key: 'bind',
		value: function bind() {
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
		}
	}, {
		key: 'draw',
		value: function draw() {
			this._glContext.drawElements(this._glContext.TRIANGLES, this._itemCount, this._glContext.UNSIGNED_SHORT, 0);
		}
	}]);

	return IndexBuffer;
}();

var ShaderProgram = exports.ShaderProgram = function () {
	function ShaderProgram(glContext) {
		_classCallCheck(this, ShaderProgram);

		this._fragment = null;
		this._vertex = null;

		this._glContext = glContext;
		// add some extensions - this enables fwidth() method, see https://www.khronos.org/registry/gles/extensions/OES/OES_standard_derivatives.txt
		this._glContext.getExtension('OES_standard_derivatives');

		this._uniformLocationCache = {};
		this._attribCache = {};
		this._shaderProgram = this._glContext.createProgram();
	}

	_createClass(ShaderProgram, [{
		key: '_compileShader',
		value: function _compileShader(glType, str) {

			var shader = this._glContext.createShader(glType);

			var prepend = '';

			if (str.indexOf('#version') === 0) {
				var versionString = str.substr(0, str.indexOf('\n'));
				str = str.substring(versionString.length);
				prepend += versionString;
			}

			prepend += 'precision mediump float;\n'; // Bodge precision on script
			prepend += '#extension GL_OES_standard_derivatives : enable\n';

			if (glType === this._glContext.VERTEX_SHADER) {
				// Add variables common to all vertex shaders
				prepend += 'uniform mat4 aModelViewProjectionMatrix;\n';
				prepend += 'attribute vec4 aVertexPosition;\n';
				prepend += 'attribute vec4 aTextureCoord;\n';
			}

			prepend += 'varying vec4 vTextureCoord[8];\n';

			str = prepend + str;

			this._glContext.shaderSource(shader, str);
			this._glContext.compileShader(shader);

			if (!this._glContext.getShaderParameter(shader, this._glContext.COMPILE_STATUS)) {
				throw new Error("Error compiling shader script " + this._glContext.getShaderInfoLog(shader));
			}

			return shader;
		}
	}, {
		key: '_shaderLoadSuccess',
		value: function _shaderLoadSuccess(xmlRaw, callback) {

			var fragmentStr, vertexStr;
			var fragmentXml, vertexXml;

			if (xmlRaw) {
				var xmlDoc = $(xmlRaw);
				fragmentXml = xmlDoc.find('fragment')[0];
				vertexXml = xmlDoc.find('vertex')[0];
			}

			if (fragmentXml && fragmentXml.textContent) {
				fragmentStr = fragmentXml.textContent;
			} else {
				fragmentStr = defaultFragmentShader;
			}
			if (vertexXml && vertexXml.textContent) {
				vertexStr = vertexXml.textContent;
			} else {
				vertexStr = defaultVertexShader;
			}

			if (this._fragment) {
				this._glContext.detachShader(this._shaderProgram, this._fragment);
			}
			if (this._vertex) {
				this._glContext.detachShader(this._shaderProgram, this._vertex);
			}

			this._fragment = this._compileShader(this._glContext.FRAGMENT_SHADER, fragmentStr);
			this._vertex = this._compileShader(this._glContext.VERTEX_SHADER, vertexStr);

			this._glContext.attachShader(this._shaderProgram, this._fragment);
			this._glContext.attachShader(this._shaderProgram, this._vertex);

			this._glContext.linkProgram(this._shaderProgram);

			if (!this._glContext.getProgramParameter(this._shaderProgram, this._glContext.LINK_STATUS)) {
				throw new Error(this._glContext.getProgramInfoLog(this._shaderProgram));
			}

			callback(null);
		}
	}, {
		key: 'loadAndLink',
		value: function loadAndLink(shaderFile, callback) {

			this._uniformLocationCache = {};
			this._attribCache = {};

			if (shaderFile && shaderFile.length > 0) {
				var that = this;
				$['ajax']({
					'url': 'shaders/' + shaderFile,
					'success': function success(xmlDoc) {
						that._shaderLoadSuccess(xmlDoc, callback);
					},
					'dataType': 'xml'
				});
			} else {
				this._shaderLoadSuccess(null, callback);
			}
		}
	}, {
		key: 'use',
		value: function use() {

			this._glContext.useProgram(this._shaderProgram);
		}
	}, {
		key: 'getUniformLocation',
		value: function getUniformLocation(name) {

			if (!this._uniformLocationCache.hasOwnProperty(name)) {
				this._uniformLocationCache[name] = this._glContext.getUniformLocation(this._shaderProgram, name);
			}
			return this._uniformLocationCache[name];
		}
	}, {
		key: 'getAttrib',
		value: function getAttrib(name) {

			if (!this._attribCache.hasOwnProperty(name)) {
				this._attribCache[name] = this._glContext.getAttribLocation(this._shaderProgram, name);
				this._glContext.enableVertexAttribArray(this._attribCache[name]);
			}
			return this._attribCache[name];
		}
	}]);

	return ShaderProgram;
}();

var FillableTexture = exports.FillableTexture = function () {
	function FillableTexture(glContext, width, height) {
		_classCallCheck(this, FillableTexture);

		this._glContext = glContext;
		this._texture = this._glContext.createTexture();
		this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);
		this._glContext.pixelStorei(this._glContext.UNPACK_FLIP_Y_WEBGL, true);
		this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, width, height, 0, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, null);
	}

	_createClass(FillableTexture, [{
		key: 'bind',
		value: function bind() {
			this._glContext.activeTexture(this._glContext.TEXTURE0);
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);

			var filtering = this._glContext.LINEAR; // NEAREST for block quality, LINEAR for softer texture

			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MAG_FILTER, filtering);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MIN_FILTER, filtering);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_S, this._glContext.CLAMP_TO_EDGE);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_T, this._glContext.CLAMP_TO_EDGE);
		}
	}, {
		key: 'fill',
		value: function fill(x, y, width, height, array) {
			this._glContext.texSubImage2D(this._glContext.TEXTURE_2D, 0, x, y, width, height, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, array);
		}
	}]);

	return FillableTexture;
}();

var OrthoCamera = exports.OrthoCamera = function () {
	function OrthoCamera(glContext) {
		_classCallCheck(this, OrthoCamera);

		this._glContext = glContext;
		this._mvMatrix = _glMat2.default.create();
		this._pMatrix = _glMat2.default.create();
	}

	_createClass(OrthoCamera, [{
		key: 'setup',
		value: function setup(width, height) {
			_glMat2.default.ortho(this._pMatrix, 0, width, 0, height, 0.1, 100);
			_glMat2.default.identity(this._mvMatrix);
			_glMat2.default.translate(this._mvMatrix, this._mvMatrix, [0.0, 0.0, -0.1]);
		}
	}, {
		key: 'getMVPMatrix',
		value: function getMVPMatrix() {
			var combined = _glMat2.default.create();
			_glMat2.default.multiply(combined, this._pMatrix, this._mvMatrix);
			return combined;
		}
	}]);

	return OrthoCamera;
}();

function getGlContext(canvas) {
	return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}

function webGlSupported() {
	try {
		var canvas = document.createElement('canvas');
		var ctx = getGlContext(canvas);
		return ctx !== null;
	} catch (e) {
		return false;
	}
}