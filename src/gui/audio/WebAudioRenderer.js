import root from 'window-or-global';
import WebAudioBuffer from './WebAudioBuffer';

export default class WebAudioRenderer {
  constructor(bufferSize, sampleRate) {
    root.AudioContext = root.AudioContext || root.webkitAudioContext;
    if (root.AudioContext === undefined) {
      throw new Error('WebAudio not supported in this browser');
    }
    this.audioContext = new root.AudioContext();
    // this.audioContext.sampleRate = sampleRate;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  setVolume(val) {
    if (this.gainNode) {
      this.gainNode.gain.value = val / 100;
    }
  }

  getSampleRate() {
    return this.audioContext.sampleRate;
  }

  createBuffer(size) {
    return new WebAudioBuffer(this.audioContext, this.gainNode, size);
  }
}
