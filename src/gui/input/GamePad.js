export default class GamePad {
  constructor(rawPad) {
    this.axisThreshold = 0.5;
    this.buttonStates = new Int32Array(rawPad.buttons.length);
    this.axesStates = new Int32Array(rawPad.axes.length);
  }


  getButtonCount() {
    return this.buttonStates.length;
  }


  // Returns 0 for not changed, 1 for pressed, 2 for not pressed
  getButtonState(rawPad, buttonIndex) {
    const isPressed = rawPad.buttons[buttonIndex].pressed;
    const intState = (isPressed ? 1 : 0);
    if (this.buttonStates[buttonIndex] !== intState) {
      this.buttonStates[buttonIndex] = intState;
      return isPressed ? 1 : 2;
    }
    return 0;
  }


  getAxisCount() {
    return this.axesStates.length;
  }

  // Returns 0 for not changed, 1 for pressed, 2 for not pressed
  getAxisState(rawPad, axisIndex) {
    const isPressed = (rawPad.axes[axisIndex] >= this.axisThreshold)
      || (rawPad.axes[axisIndex] <= -this.axisThreshold);
    const intState = (isPressed ? 1 : 0);
    if (this.axesStates[axisIndex] !== intState) {
      this.axesStates[axisIndex] = intState;
      return isPressed ? 1 : 2;
    }
    return 0;
  }
}
