import mat4 from 'gl-mat4';

const defaultVertexShader =
		`void main(void) {
			gl_Position = aModelViewProjectionMatrix * aVertexPosition;
			vTextureCoord[0] = aTextureCoord;
		}`;

const defaultFragmentShader =
		`uniform sampler2D rubyTexture;
		void main(void) {
			gl_FragColor = texture2D(rubyTexture, vec2(vTextureCoord[0].s, vTextureCoord[0].t));
		}`;

export class VertexBuffer {
  constructor(glContext) {
    this._glContext = glContext;
    this._itemSize = 0;
    this._itemCount = 0;
    this._buffer = this._glContext.createBuffer();
  }

  setData(vertices, itemSize, itemCount) {
		// ELEMENT_ARRAY_BUFFER is used by index buffer, ARRAY_BUFFER by vertex and tex coord buffers
    this._itemSize = itemSize;
    this._itemCount = itemCount;
    this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
    this._glContext.bufferData(this._glContext.ARRAY_BUFFER, vertices, this._glContext.STATIC_DRAW);
  }


  bind(positionAttribute) {
    this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
    this._glContext.vertexAttribPointer(positionAttribute, this._itemSize, this._glContext.FLOAT, false, 0, 0);
  }
}


export class IndexBuffer {
  constructor(glContext) {
    this._glContext = glContext;
    this._itemCount = 0;
    this._buffer = this._glContext.createBuffer();
  }

  setData(indices, itemCount) {
    this._itemCount = itemCount;
    this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
    this._glContext.bufferData(this._glContext.ELEMENT_ARRAY_BUFFER, indices, this._glContext.STATIC_DRAW);
  }

  bind() {
    this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
  }

  draw() {
    this._glContext.drawElements(this._glContext.TRIANGLES, this._itemCount, this._glContext.UNSIGNED_SHORT, 0);
  }
}


export class ShaderProgram {
  constructor(glContext) {
    this._fragment = null;
    this._vertex = null;

    this._glContext = glContext;
		// add some extensions - this enables fwidth() method, see https://www.khronos.org/registry/gles/extensions/OES/OES_standard_derivatives.txt
    this._glContext.getExtension('OES_standard_derivatives');

    this._uniformLocationCache = {};
    this._attribCache = {};
    this._shaderProgram = this._glContext.createProgram();
  }


  _compileShader(glType, str) {
    const shader = this._glContext.createShader(glType);

    let prepend = '';

    if (str.indexOf('#version') === 0) {
      const versionString = str.substr(0, str.indexOf('\n'));
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
      throw new Error(`Error compiling shader script ${this._glContext.getShaderInfoLog(shader)}`);
    }

    return shader;
  }


  _shaderLoadSuccess(xmlRaw, callback) {
    let fragmentStr,
      vertexStr;
    let fragmentXml,
      vertexXml;

    if (xmlRaw) {
      const xmlDoc = $(xmlRaw);
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


  loadAndLink(shaderFile, callback) {
    this._uniformLocationCache = {};
    this._attribCache = {};

    if (shaderFile && shaderFile.length > 0) {
      const that = this;
      $.ajax({
        url: `shaders/${shaderFile}`,
        success(xmlDoc) { that._shaderLoadSuccess(xmlDoc, callback); },
        dataType: 'xml',
      });
    } else {
      this._shaderLoadSuccess(null, callback);
    }
  }


  use() {
    this._glContext.useProgram(this._shaderProgram);
  }


  getUniformLocation(name) {
    if (!this._uniformLocationCache.hasOwnProperty(name)) {
			 this._uniformLocationCache[name] = this._glContext.getUniformLocation(this._shaderProgram, name);
    }
    return this._uniformLocationCache[name];
  }


  getAttrib(name) {
    if (!this._attribCache.hasOwnProperty(name)) {
      this._attribCache[name] = this._glContext.getAttribLocation(this._shaderProgram, name);
      this._glContext.enableVertexAttribArray(this._attribCache[name]);
    }
    return this._attribCache[name];
  }
}


export class FillableTexture {
  constructor(glContext, width, height) {
    this._glContext = glContext;
    this._texture = this._glContext.createTexture();
    this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);
    this._glContext.pixelStorei(this._glContext.UNPACK_FLIP_Y_WEBGL, true);
    this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, width, height, 0, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, null);
  }

  bind() {
    this._glContext.activeTexture(this._glContext.TEXTURE0);
    this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);

    const filtering = this._glContext.LINEAR; // NEAREST for block quality, LINEAR for softer texture

    this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MAG_FILTER, filtering);
    this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MIN_FILTER, filtering);
    this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_S, this._glContext.CLAMP_TO_EDGE);
    this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_T, this._glContext.CLAMP_TO_EDGE);
  }

  fill(x, y, width, height, array) {
    this._glContext.texSubImage2D(this._glContext.TEXTURE_2D, 0, x, y, width, height, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, array);
  }
}


export class OrthoCamera {
  constructor(glContext) {
    this._glContext = glContext;
    this._mvMatrix = mat4.create();
    this._pMatrix = mat4.create();
  }

  setup(width, height) {
    mat4.ortho(this._pMatrix, 0, width, 0, height, 0.1, 100);
    mat4.identity(this._mvMatrix);
    mat4.translate(this._mvMatrix, this._mvMatrix, [0.0, 0.0, -0.1]);
  }

  getMVPMatrix() {
    const combined = mat4.create();
    mat4.multiply(combined, this._pMatrix, this._mvMatrix);
    return combined;
  }
}

export function getGlContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

export function webGlSupported() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = getGlContext(canvas);
    return ctx !== null;
  }	catch (e) {
    return false;
  }
}
