export default class WebAudioBuffer {
  constructor(audioContext, masterVolNode, size) {
    this._locked = false;
    this.audioContext = audioContext;

    this.audioNode = null;
    this._gainNode = this.audioContext.createGain();
    this._gainNode.connect(masterVolNode);

    this.audioBuffer = this.audioContext.createBuffer(1, size, this.audioContext.sampleRate);
  }

  lockBuffer() {
    this._locked = true;
    return this.audioBuffer.getChannelData(0);
  }

  unlockBuffer() {
    this._locked = false;

		// Alternative method using audio node buffer instead of onaudioprocess
    if (this.audioNode) {
			 this.audioNode.disconnect();
			 this.audioNode = null;
    }
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.audioBuffer;

    this.audioNode.connect(this._gainNode);
    this.audioNode.start(0);
  }
}

