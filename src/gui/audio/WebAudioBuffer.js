export default class WebAudioBuffer {
  constructor(audioContext, masterVolNode, size) {
    this.locked = false;
    this.audioContext = audioContext;

    this.audioNode = null;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(masterVolNode);

    this.audioBuffer = this.audioContext.createBuffer(1, size, this.audioContext.sampleRate);
  }

  lockBuffer() {
    this.locked = true;
    return this.audioBuffer.getChannelData(0);
  }

  unlockBuffer() {
    this.locked = false;

    // Alternative method using audio node buffer instead of onaudioprocess
    if (this.audioNode) {
      this.audioNode.disconnect();
      this.audioNode = null;
    }
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.audioBuffer;

    this.audioNode.connect(this.gainNode);
    this.audioNode.start(0);
  }
}

