

this.WebGl = this.WebGl || {};

(function () {
	"use strict";

	var defaultVertexShader =
		"void main(void) {" +
		"gl_Position = aModelViewProjectionMatrix * aVertexPosition;" +
		"vTextureCoord[0] = aTextureCoord;" +
		"}";

	var defaultFragmentShader =
		"uniform sampler2D rubyTexture;" +
		"void main(void) {" +
		"gl_FragColor = texture2D(rubyTexture, vec2(vTextureCoord[0].s, vTextureCoord[0].t));" +
		"}";


	var getGlContext = function (canvas) {
		return canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
	};

	var VertexBuffer = function (glContext) {
		this.glContext = glContext;
		this.itemSize = 0;
		this.itemCount = 0;
		this.buffer = this.glContext.createBuffer();
	};

	VertexBuffer.prototype.setData = function (vertices, itemSize, itemCount) {

		// ELEMENT_ARRAY_BUFFER is used by index buffer, ARRAY_BUFFER by vertex and tex coord buffers
		this.itemSize = itemSize;
		this.itemCount = itemCount;
		this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);
		this.glContext.bufferData(this.glContext.ARRAY_BUFFER, vertices, this.glContext.STATIC_DRAW);
	};


	VertexBuffer.prototype.bind = function (positionAttribute) {
		this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);
		this.glContext.vertexAttribPointer(positionAttribute, this.itemSize, this.glContext.FLOAT, false, 0, 0);
	};



	var IndexBuffer = function (glContext) {

		this.glContext = glContext;
		this.itemCount = 0;
		this.buffer = this.glContext.createBuffer();
	};

	IndexBuffer.prototype.setData = function (indices, itemCount) {
		this.itemCount = itemCount;
		this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.buffer);
		this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER, indices, this.glContext.STATIC_DRAW);
	};

	IndexBuffer.prototype.bind = function () {
		this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.buffer);
	};

	IndexBuffer.prototype.draw = function () {
		this.glContext.drawElements(this.glContext.TRIANGLES, this.itemCount, this.glContext.UNSIGNED_SHORT, 0);
	};


	var ShaderProgram = function (glContext) {

		this.fragment = null;
		this.vertex = null;

		this.glContext = glContext;
		// add some extensions - this enables fwidth() method, see https://www.khronos.org/registry/gles/extensions/OES/OES_standard_derivatives.txt
		this.glContext.getExtension('OES_standard_derivatives');

		this.uniformLocationCache = {};
		this.attribCache = {};
		this.shaderProgram = this.glContext.createProgram();
	};


	ShaderProgram.prototype.compileShader = function (glType, str) {

		var shader = this.glContext.createShader(glType);

		var prepend = '';

		if (str.indexOf('#version') === 0) {
			var versionString = str.substr(0, str.indexOf('\n'));
			str = str.substring(versionString.length);
			prepend += versionString;
		}

		prepend += 'precision mediump float;\n'; // Bodge precision on script
		prepend += '#extension GL_OES_standard_derivatives : enable\n';

		if (glType === this.glContext.VERTEX_SHADER) {
			// Add variables common to all vertex shaders
			prepend += 'uniform mat4 aModelViewProjectionMatrix;\n';
			prepend += 'attribute vec4 aVertexPosition;\n';
			prepend += 'attribute vec4 aTextureCoord;\n';
		}

		prepend += 'varying vec4 vTextureCoord[8];\n';

		str = prepend + str;

		this.glContext.shaderSource(shader, str);
		this.glContext.compileShader(shader);

		if (!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)) {
			throw new Error("Error compiling shader script " + this.glContext.getShaderInfoLog(shader));
		}

		return shader;
	};


	ShaderProgram.prototype.shaderLoadSuccess = function (xmlRaw, callback) {

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

		if (this.fragment) {
			this.glContext.detachShader(this.shaderProgram, this.fragment);
		}
		if (this.vertex) {
			this.glContext.detachShader(this.shaderProgram, this.vertex);
		}

		this.fragment = this.compileShader(this.glContext.FRAGMENT_SHADER, fragmentStr);
		this.vertex = this.compileShader(this.glContext.VERTEX_SHADER, vertexStr);

		this.glContext.attachShader(this.shaderProgram, this.fragment);
		this.glContext.attachShader(this.shaderProgram, this.vertex);

		this.glContext.linkProgram(this.shaderProgram);

		if (!this.glContext.getProgramParameter(this.shaderProgram, this.glContext.LINK_STATUS)) {
			throw new Error(this.glContext.getProgramInfoLog(this.shaderProgram));
		}

		callback(null);
	};


	ShaderProgram.prototype.loadAndLink = function (shaderFile, callback) {

		this.uniformLocationCache = {};
		this.attribCache = {};

		if (shaderFile && shaderFile.length > 0) {
			var that = this;
			$['ajax']({
				'url': 'shaders/' + shaderFile,
				'success': function (xmlDoc) { that.shaderLoadSuccess(xmlDoc, callback); },
				'dataType': 'xml'
			});
		} else {
			this.shaderLoadSuccess(null, callback);
		}
	};


	ShaderProgram.prototype.use = function () {

		this.glContext.useProgram(this.shaderProgram);
	};


	ShaderProgram.prototype.getUniformLocation = function (name) {

		if (!this.uniformLocationCache.hasOwnProperty(name)) {
			this.uniformLocationCache[name] = this.glContext.getUniformLocation(this.shaderProgram, name);
		}
		return this.uniformLocationCache[name];
	};


	ShaderProgram.prototype.getAttrib = function (name) {

		if (!this.attribCache.hasOwnProperty(name)) {
			this.attribCache[name] = this.glContext.getAttribLocation(this.shaderProgram, name);
			this.glContext.enableVertexAttribArray(this.attribCache[name]);
		}
		return this.attribCache[name];
	};


	var FillableTexture = function (glContext, width, height) {

		this.glContext = glContext;
		this.texture = this.glContext.createTexture();
		this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);
		this.glContext.pixelStorei(this.glContext.UNPACK_FLIP_Y_WEBGL, true);
		this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, this.glContext.RGBA, width, height, 0, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, null);
	};

	FillableTexture.prototype.bind = function () {

		this.glContext.activeTexture(this.glContext.TEXTURE0);
		this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);

		var filtering = this.glContext.LINEAR; // NEAREST for block quality, LINEAR for softer texture

		this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, filtering);
		this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, filtering);
		this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
		this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
	};

	FillableTexture.prototype.fill = function (x, y, width, height, array) {

		this.glContext.texSubImage2D(this.glContext.TEXTURE_2D, 0, x, y, width, height, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, array);
	};



	var OrthoCamera = function (glContext) {

		this.glContext = glContext;
		this.mvMatrix = mat4.create();
		this.pMatrix = mat4.create();
	};

	OrthoCamera.prototype.setup = function (width, height) {

		mat4.ortho(this.pMatrix, 0, width, 0, height, 0.1, 100);
		mat4.identity(this.mvMatrix);
		mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -0.1]);
	};

	OrthoCamera.prototype.getMVPMatrix = function () {
		var combined = mat4.create();
		mat4.multiply(combined, this.pMatrix, this.mvMatrix);
		return combined;
	};


	WebGl.OrthoCamera = OrthoCamera;
	WebGl.FillableTexture = FillableTexture;
	WebGl.ShaderProgram = ShaderProgram;
	WebGl.VertexBuffer = VertexBuffer;
	WebGl.IndexBuffer = IndexBuffer;


	WebGl.webGlSupported = function () {
		try {
			var canvas = document.createElement('canvas');
			var ctx = getGlContext(canvas);
			return ctx !== null;
		}
		catch (e) {
			return false;
		}
	};

	WebGl.getGlContext = getGlContext;

}());
