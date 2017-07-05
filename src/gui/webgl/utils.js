import root from 'window-or-global';
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
    this.glContext = glContext;
    this.itemSize = 0;
    this.itemCount = 0;
    this.buffer = this.glContext.createBuffer();
  }

  setData(vertices, itemSize, itemCount) {
    // ELEMENT_ARRAY_BUFFER is used by index buffer, ARRAY_BUFFER by vertex and tex coord buffers
    this.itemSize = itemSize;
    this.itemCount = itemCount;
    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);
    this.glContext.bufferData(this.glContext.ARRAY_BUFFER, vertices, this.glContext.STATIC_DRAW);
  }


  bind(positionAttribute) {
    this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, this.buffer);
    this.glContext.vertexAttribPointer(positionAttribute, this.itemSize,
      this.glContext.FLOAT, false, 0, 0);
  }
}


export class IndexBuffer {
  constructor(glContext) {
    this.glContext = glContext;
    this.itemCount = 0;
    this.buffer = this.glContext.createBuffer();
  }

  setData(indices, itemCount) {
    this.itemCount = itemCount;
    this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.glContext.bufferData(this.glContext.ELEMENT_ARRAY_BUFFER,
      indices, this.glContext.STATIC_DRAW);
  }

  bind() {
    this.glContext.bindBuffer(this.glContext.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  draw() {
    this.glContext.drawElements(this.glContext.TRIANGLES, this.itemCount,
      this.glContext.UNSIGNED_SHORT, 0);
  }
}


export class ShaderProgram {
  constructor(glContext) {
    this.fragment = null;
    this.vertex = null;

    this.glContext = glContext;
    // add some extensions - this enables fwidth() method,
    // see http://mkl.ski/u/481816
    this.glContext.getExtension('OES_standard_derivatives');

    this.uniformLocationCache = {};
    this.attribCache = {};
    this.shaderProgram = this.glContext.createProgram();
  }


  _compileShader(glType, str) {
    let glString = str;
    const shader = this.glContext.createShader(glType);

    let prepend = '';

    if (glString.indexOf('#version') === 0) {
      const versionString = glString.substr(0, glString.indexOf('\n'));
      glString = glString.substring(versionString.length);
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

    glString = `${prepend}${glString}`;

    this.glContext.shaderSource(shader, glString);
    this.glContext.compileShader(shader);

    if (!this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS)) {
      throw new Error(`Error compiling shader script ${this.glContext.getShaderInfoLog(shader)}`);
    }

    return shader;
  }


  _shaderLoadSuccess(xmlRaw, callback) {
    let fragmentStr = defaultFragmentShader;
    let vertexStr = defaultVertexShader;
    let fragmentXml;
    let vertexXml;

    if (xmlRaw) {
      // IE9+
      const parser = new root.DOMParser();
      const xmlDoc = parser.parseFromString(xmlRaw, 'application/xml');
      fragmentXml = xmlDoc.querySelector('fragment');
      vertexXml = xmlDoc.querySelector('vertex');
    }

    if (fragmentXml && fragmentXml.textContent) {
      fragmentStr = fragmentXml.textContent;
    }
    if (vertexXml && vertexXml.textContent) {
      vertexStr = vertexXml.textContent;
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
  }


  loadAndLink(shaderFile, callback) {
    this.uniformLocationCache = {};
    this.attribCache = {};

    if (shaderFile && shaderFile.length > 0) {
      const that = this;
      // #TODO god damned jquery
      $.ajax({
        url: `shaders/${shaderFile}`,
        success(xmlDoc) { that._shaderLoadSuccess(xmlDoc, callback); },
        dataType: 'xml',
      });
    } else {
      this.shaderLoadSuccess(null, callback);
    }
  }


  use() {
    this.glContext.useProgram(this.shaderProgram);
  }


  getUniformLocation(name) {
    if (!this.uniformLocationCache.hasOwnProperty(name)) {
      this.uniformLocationCache[name] = this.glContext.getUniformLocation(this.shaderProgram, name);
    }
    return this.uniformLocationCache[name];
  }


  getAttrib(name) {
    if (!this.attribCache.hasOwnProperty(name)) {
      this.attribCache[name] = this.glContext.getAttribLocation(this.shaderProgram, name);
      this.glContext.enableVertexAttribArray(this.attribCache[name]);
    }
    return this.attribCache[name];
  }
}


export class FillableTexture {
  constructor(glContext, width, height) {
    this.glContext = glContext;
    this.texture = this.glContext.createTexture();
    this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);
    this.glContext.pixelStorei(this.glContext.UNPACK_FLIP_Y_WEBGL, true);
    this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, this.glContext.RGBA, width, height, 0, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, null);
  }

  bind() {
    this.glContext.activeTexture(this.glContext.TEXTURE0);
    this.glContext.bindTexture(this.glContext.TEXTURE_2D, this.texture);

    const filtering = this.glContext.LINEAR; // NEAREST for block quality, LINEAR for softer texture

    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, filtering);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, filtering);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
    this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
  }

  fill(x, y, width, height, array) {
    this.glContext.texSubImage2D(this.glContext.TEXTURE_2D, 0, x, y, width, height, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, array);
  }
}


export class OrthoCamera {
  constructor(glContext) {
    this.glContext = glContext;
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
  }

  setup(width, height) {
    mat4.ortho(this.pMatrix, 0, width, 0, height, 0.1, 100);
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -0.1]);
  }

  getMVPMatrix() {
    const combined = mat4.create();
    mat4.multiply(combined, this.pMatrix, this.mvMatrix);
    return combined;
  }
}

export function getGlContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

export function webGlSupported() {
  try {
    const canvas = root.document.createElement('canvas');
    const ctx = getGlContext(canvas);
    return ctx !== null;
  } catch (e) {
    return false;
  }
}
