import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  gClearScreenArray,
} from '../../config/consts';

import { saveAs } from 'file-saver';

import { rusha } from '../../utils/serialisation';

import {
  getGlContext,
  OrthoCamera,
  FillableTexture,
  ShaderProgram,
  VertexBuffer,
  IndexBuffer,
} from './utils';

// Must be power of 2
const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


export default class WebGlRenderSurface {
  constructor(canvasParent) {
    this.ready = false;

    this.clearArray = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
    this.clearArrayColour = this.clearArray[0];

    this.bufferIndexArray = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
    this.offscreen32BitView = new Uint32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
    this.offscreen8BitView = new Uint8Array(this.offscreen32BitView.buffer);

    this.element = canvasParent.getCanvasElement();
    this.glContext = getGlContext(this.element);

    this.camera = new OrthoCamera(this.glContext);
    this.camera.setup(SCREEN_WIDTH, SCREEN_HEIGHT);

    this.initBuffers();

    this.texture = new FillableTexture(this.glContext, TEXTURE_WIDTH, TEXTURE_HEIGHT);

    canvasParent.connect('resize', this.onResize.bind(this));

    this.inputSizeShaderArray = new Float32Array([SCREEN_WIDTH, SCREEN_HEIGHT]);
    this.outputSizeShaderArray = new Float32Array([SCREEN_WIDTH, SCREEN_HEIGHT]);
    this.textureSizeShaderArray = new Float32Array([TEXTURE_WIDTH, TEXTURE_HEIGHT]);

    this.shader = new ShaderProgram(this.glContext);

    this.loadShader(null, () => {
      this.ready = true;
    });
  }


  loadShader(shaderFilename, callback) {
    const that = this;
    this.shader.loadAndLink(shaderFilename, () => {
      that.shader.use();

      that.glContext.uniform2fv(that.shader.getUniformLocation('rubyInputSize'), that.inputSizeShaderArray);
      that.glContext.uniform2fv(that.shader.getUniformLocation('rubyOutputSize'), that.outputSizeShaderArray);
      that.glContext.uniform2fv(that.shader.getUniformLocation('rubyTextureSize'), that.textureSizeShaderArray);

      that.glContext.uniformMatrix4fv(that.shader.getUniformLocation('aModelViewProjectionMatrix'), false, that.camera.getMVPMatrix());

      that.vertexBuffer.bind(that.shader.getAttrib('aVertexPosition'));
      that.textureCoordBuffer.bind(that.shader.getAttrib('aTextureCoord'));
      that.indexBuffer.bind();
      that.texture.bind();

      that.glContext.uniform1i(that.shader.getUniformLocation('rubyTexture'), 0); // Texture unit 0 is for base images.

      callback();
    });
  }


  initBuffers() {
    const t = SCREEN_WIDTH / TEXTURE_WIDTH;
    const u = SCREEN_HEIGHT / TEXTURE_HEIGHT;

    const vertices = new Float32Array([
      0, 0, 0.0, 1.0,
      SCREEN_WIDTH, 0, 0.0, 1.0,
      SCREEN_WIDTH, SCREEN_HEIGHT, 0.0, 1.0,
      0, SCREEN_HEIGHT, 0.0, 1.0,
    ]);
    const texCoords = new Float32Array([
      0.0, 0.0,
      t, 0.0,
      t, u,
      0.0, u,
    ]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    this.vertexBuffer = new VertexBuffer(this.glContext);
    this.vertexBuffer.setData(vertices, 4, 4);

    this.textureCoordBuffer = new VertexBuffer(this.glContext);
    this.textureCoordBuffer.setData(texCoords, 2, 4);

    this.indexBuffer = new IndexBuffer(this.glContext);
    this.indexBuffer.setData(indices, 6);
  }


  onResize() {
    this.glContext.viewport(0, 0, this.element.width, this.element.height);
    this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
  }


  writeToBuffer(bufferIndex, insertIndex, colour) {
    const existingIndex = this.bufferIndexArray[insertIndex];
    if (existingIndex <= bufferIndex) {
      this.offscreen32BitView[insertIndex] = 0xFF000000 | colour;
      this.bufferIndexArray[insertIndex] = bufferIndex;
    }
  }


  getRenderBufferHash() {
    return rusha.digestFromArrayBuffer(this.offscreen32BitView).toUpperCase();
  }


  clearBuffers(backgroundColour) {
    // update clear array if background colour changes
    if (backgroundColour !== this.clearArrayColour) {
      for (let i = 0; i < this.clearArray.length; ++i) {
        this.clearArray[i] = 0xFF000000 | backgroundColour;
      }
      this.clearArrayColour = backgroundColour;
    }

    // set background colour
    this.offscreen32BitView.set(this.clearArray);

    // Nes.ClearScreenArray is a quicker way of clearing this array
    this.bufferIndexArray.set(gClearScreenArray);
  }


  render(mainboard) {
    if (!this.ready) {
      return;
    }
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    this.texture.fill(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, this.offscreen8BitView);
    this.glContext.uniform1i(this.shader.getUniformLocation('rubyFrameCount'), mainboard.ppu.frameCounter);
    this.indexBuffer.draw();
  }


  createCanvasWithScreenshotOn() {
    // create copy of offscreen buffer into a new canvas element
    const element = document.createElement('canvas');
    element.width = SCREEN_WIDTH;
    element.height = SCREEN_HEIGHT;
    const canvas = element.getContext('2d');
    const imgData = canvas.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    imgData.data.set(this.offscreen8BitView.subarray(0, SCREEN_WIDTH * SCREEN_HEIGHT * 4));
    canvas.putImageData(imgData, 0, 0);
    return element;
  }


  screenshotToFile() {
    const element = this.createCanvasWithScreenshotOn();
    element.toBlob((blob) => {
      saveAs(blob, 'screenshot.png');
    });
  }


  screenshotToString() {
    const element = this.createCanvasWithScreenshotOn();
    return element.toDataURL('image/png');
  }


  loadShaderFromUrl(url) {
    this.loadShader(url, () => { });
  }
}
