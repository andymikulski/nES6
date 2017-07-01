export default class GamePad {
  constructor(rawPad) {
    this._axisThreshold = 0.5;
    this._buttonStates = new Int32Array(rawPad.buttons.length);
    this._axesStates = new Int32Array(rawPad.axes.length);
  }


  getButtonCount() {
    return this._buttonStates.length;
  }


	// Returns 0 for not changed, 1 for pressed, 2 for not pressed
  getButtonState(rawPad, buttonIndex) {
    const isPressed = rawPad.buttons[buttonIndex].pressed;
    const intState = (isPressed ? 1 : 0);
    if (this._buttonStates[buttonIndex] !== intState) {
      this._buttonStates[buttonIndex] = intState;
      return isPressed ? 1 : 2;
    }
    return 0;
  }


  getAxisCount() {
    return this._axesStates.length;
  }

	// Returns 0 for not changed, 1 for pressed, 2 for not pressed
  getAxisState(rawPad, axisIndex) {
    const isPressed = rawPad.axes[axisIndex] >= this._axisThreshold || rawPad.axes[axisIndex] <= -this._axisThreshold;
    const intState = (isPressed ? 1 : 0);
    if (this._axesStates[axisIndex] !== intState) {
      this._axesStates[axisIndex] = intState;
      return isPressed ? 1 : 2;
    }
    return 0;
  }
}
