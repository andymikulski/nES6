import Joypad from './Joypad';

export default class InputDeviceBus {
  constructor() {
    this.j1 = new Joypad();
    this.j2 = new Joypad();
  }

  getJoypad(index) {
    switch (index) {
      case 0:
        return this.j1;
      case 1:
        return this.j2;
      default:
        return null;
    }
  }

  writeToRegister(offset, data) {
    switch (offset) {
      case 0x4016:
        this.j1.writeToRegister(offset, data);
        break;
      case 0x4017:
        this.j2.writeToRegister(offset, data);
        break;
    }
  }

  readFromRegister(offset) {
    var ret = 0;
    switch (offset) {
      case 0x4016:
        ret = this.j1.readFromRegister(offset) | 0;
        break;
      case 0x4017:
        ret = this.j2.readFromRegister(offset) | 0;
        break;
    }
    return ret;
  }
}
