import WebAudioBuffer from './WebAudioBuffer.js';

export default class WebAudioRenderer {
  constructor(bufferSize, sampleRate) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (window.AudioContext === undefined) {
      throw new Error('WebAudio not supported in this browser');
    }
    this.audioContext = new window.AudioContext();
    this._gainNode = this.audioContext.createGain();
    this._gainNode.connect(this.audioContext.destination);
  }

  setVolume(val) {
    if (this._gainNode) {
      this._gainNode.gain.value = val / 100;
    }
  }

  getSampleRate() {
    return this.audioContext.sampleRate;
  }

  createBuffer(size) {
    return new WebAudioBuffer(this.audioContext, this._gainNode, size);
  }
}
