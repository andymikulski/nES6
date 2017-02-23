import Rusha from 'rusha';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/consts';

export default class TestRenderSurface {
	constructor(canvasParent) {
		this._buffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
	}

	writeToBuffer(bufferIndex, insertIndex, colour) {
		this._buffer[insertIndex] = 0xFF000000 | colour;
	}

	clearBuffers(backgroundColour) {
		for (let i = 0; i < this._buffer.length; ++i) {
			this._buffer[i] = 0xFF000000 | backgroundColour;
		}
	}

	getRenderBufferHash() {
		const rusha = new Rusha();
		return rusha.digestFromArrayBuffer(this._buffer).toUpperCase();
	}
}
