/* eslint class-methods-use-this: 0*/

import { rusha } from '../../utils/serialisation';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/consts';

export default class HeadlessRenderSurface {
  constructor() {
    this.buffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
  }

  writeToBuffer(bufferIndex, insertIndex, colour) {
    this.buffer[insertIndex] = 0xFF000000 | colour;
  }

  clearBuffers(backgroundColour) {
    for (let i = 0; i < this.buffer.length; ++i) {
      this.buffer[i] = 0xFF000000 | backgroundColour;
    }
  }

  getRenderBufferHash() {
    return rusha.digestFromArrayBuffer(this.buffer).toUpperCase();
  }

  render() {}

  screenshot() {}

  screenshotToString() {
    return '';
  }
}
