import Joypad from './Joypad';

export default class InputDeviceBus {
  constructor() {
    this.joyPads = {
      0x4016: new Joypad(),
      0x4017: new Joypad(),
    };
  }

  getJoypad(index) {
    return this.joyPads[Object.keys(this.joyPads)[index]];
  }

  writeToRegister(offset, data) {
    const pad = this.joyPads[offset];

    if (pad) {
      pad.writeToRegister(data);
    }
  }

  readFromRegister(offset) {
    let registerValue = 0;
    const pad = this.joyPads[offset];

    if (pad) {
      registerValue = pad.readFromRegister() | 0;
    }

    return registerValue;
  }
}
