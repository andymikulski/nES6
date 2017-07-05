export default class Joypad {
  constructor() {
    this.currentState = 0;
    this.strobedState = 0;
    this.strobeByte = 0;
    this.readCount = 0;
  }


  writeToRegister(data) {
    const firstBit = data & 1;
    if (this.strobeByte === 1 || firstBit === 1) {
      this.strobeByte = firstBit | 0;
      this.strobedState = this.currentState;
      this.readCount = 0;
    }
  }

  readFromRegister() {
    let ret = 0;
    if (this.strobeByte === 1) {
      this.strobedState = this.currentState;
      this.readCount = 0;
      ret = (this.strobedState & 1) | 0;
    } else {
      ret = ((this.strobedState >> this.readCount) & 1) | 0;
      this.readCount++;
      ret |= 0x40;
    }
    return ret | 0;
  }


  _getDuplicateMask(buttonIndex) {
    // disallow pressing up+down and left+right at the same time - always keep the button that is already pressed
    switch (buttonIndex) {
      case 4: // UP
        return 0xDF; // ~( 0x20 );
      case 5: // DOWN
        return 0xEF; // ~( 0x10 );
      case 6: // LEFT
        return 0x7F; // ~( 0x80 );
      case 7: // RIGHT
        return 0xBF; // ~( 0x40 );
    }
    return 0xFF;
  }


  pressButton(buttonIndex, pressed) {
    if (pressed) {
      this.currentState |= (1 << buttonIndex);
      this.currentState &= this.getDuplicateMask(buttonIndex); // this prevents up+down and left+right being pressed
    } else {
      this.currentState &= 0xFF ^ (1 << buttonIndex);
    }
  }


  saveState() {
    return {
      _currentState: this.currentState,
      _strobedState: this.strobedState,
      _strobeByte: this.strobeByte,
      _readCount: this.readCount,
    };
  }


  loadState(state) {
    this.currentState = state._currentState;
    this.strobedState = state._strobedState;
    this.readCount = state._readCount;
    this.strobeByte = state._strobeByte;
  }
}
