export default class Joypad {
  constructor() {
    this._currentState = 0;
    this._strobedState = 0;
    this._strobeByte = 0;
    this._readCount = 0;
  }


  writeToRegister(data) {
    const firstBit = data & 1;
    if (this._strobeByte === 1 || firstBit === 1) {
      this._strobeByte = firstBit | 0;
      this._strobedState = this._currentState;
      this._readCount = 0;
    }
  }

  readFromRegister() {

    var ret = 0;
    if (this._strobeByte === 1) {
      this._strobedState = this._currentState;
      this._readCount = 0;
      ret = (this._strobedState & 1) | 0;
    } else {
      ret = ((this._strobedState >> this._readCount) & 1) | 0;
      this._readCount++;
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
      this._currentState |= (1 << buttonIndex);
      this._currentState &= this._getDuplicateMask(buttonIndex); // this prevents up+down and left+right being pressed
    } else {
      this._currentState &= 0xFF ^ (1 << buttonIndex);
    }
  }


  saveState() {
    return {
      _currentState: this._currentState,
      _strobedState: this._strobedState,
      _strobeByte: this._strobeByte,
      _readCount: this._readCount
    };
  }


  loadState(state) {
    this._currentState = state._currentState;
    this._strobedState = state._strobedState;
    this._readCount = state._readCount;
    this._strobeByte = state._strobeByte;
  }
}
