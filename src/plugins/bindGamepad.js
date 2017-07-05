/* eslint import/no-mutable-exports:0*/
import root from 'window-or-global';

/**
 * nES6 plugin to bind keyboard events to joypads. Defaults to a 'sensible' key
 * mapping, but also allows for overriding any/all of the map.
 *
 * Example:

import bindGamepadPlugin, { GAMEPAD_KEY_DEFAULTS } from './plugins/bindGamepad';
const App = new nES6({
  plugins: [
    bindGamepadPlugin({
      ...GAMEPAD_KEY_DEFAULTS,
      1: 'B',
      2: 'A',
    })
  ],
});

 */

// List of buttons present on the joypad - used to determine if a keymap is complete
const joypadButtons = [
  'A',
  'B',
  'SELECT',
  'START',
  'LEFT',
  'RIGHT',
  'UP',
  'DOWN',
];

/**
 * KeyboardEvent keyCodes and their corresponding gamepad button.
 * @type {Object}
 */
export const GAMEPAD_KEY_DEFAULTS = {
  0: 'B',
  1: 'A',
  2: 'A',
  3: 'B',
  4: 'B',
  5: 'A',
  8: 'SELECT',
  9: 'START',
  12: 'UP',
  13: 'DOWN',
  14: 'LEFT',
  15: 'RIGHT',
};

/**
 * Configurable keyboard mapping object, based on GAMEPAD_KEY_DEFAULTS.
 * @type {Object}
 */
export let keyMap = { ...GAMEPAD_KEY_DEFAULTS };

/**
 * Checks given key map and determines if there are keys left unbound.
 * Displays console warnings if there is a missing binding.
 *
 * @param  {Object} map   Key map to inspect
 * @return {void}
 */
const checkMapCompleteness = (map) => {
  const values = Object.keys(map).map(binding => map[binding]);

  joypadButtons.forEach((button) => {
    if (values.indexOf(button) === -1) {
      throw new Error(`"${button}" button missing on given gamepad keymap.`);
    }
  });
};

// Track the response from navigator.getGamepads() internally
let gamePads = [];
// Track the buttons that were pressed during the previous frame
const lastPressedButtons = [];

/**
 * Gamepad dis/connection event handler. Basically just reads navigator.getGamepads(),
 * saves them internally, and then returns whether or not any gamepads were detected.
 *
 * @return {Boolean}  Were any gamepads found?
 */
const registerGamepads = () => {
  if (!root.navigator || !root.navigator.getGamepads) {
    return false;
  }

  gamePads = Array.from(root.navigator.getGamepads()).filter(x => x);
  return gamePads.length > 0;
};


/**
 * Gamepad poller. Bulk of the plugin.
 *
 * Checks for existing gamepads. If any exist, they are queried for button status.
 * Pressed buttons are tracked internally to determine whether or not button state
 * has changed between frames. When a change HAS occurred, the appropriate nES6
 * command is called to de/press that input. Calls requestAnimationFrame to poll,
 * but will not tick if no gamepads found. The `gamepadconnected` event should cause
 * the poller to spin up again.
 *
 * Note that this is styled as a factory in order to keep the export function
 * a little bit more concise.
 *
 * @param  {nES6}   nesInstance   Active nES6 instance to bind to.
 * @return {function}             Function that polls gamepads and applies to the
 *                                given nES6 instance.
 */
const pollGamepads = nesInstance =>
  () => {
    // We need to poll registerGamepads each frame to get an accurate gamepad
    // button state - otherwise, Chrome will return one button as always pressed.
    if (!registerGamepads()) {
      return;
    }
    const registeredChanges = [];

    // For each gamepad hooked up, we have to check each button's `pressed` state
    gamePads.forEach((pad, padIndex) => {
      // Get a list of the currently pressed buttons based on `pressed`
      const currentlyPressed = [];
      (pad.buttons || []).forEach((butt, idx) => {
        if (butt.pressed) {
          currentlyPressed.push({
            idx,
            pressed: butt.pressed,
          });
        }
      });

      // Check out all the pressed buttons from last frame on this gamepad,
      // and determine if it still is pressed (by checking if it is in the new
      // array of pressed buttons).
      (lastPressedButtons[padIndex] || []).forEach((oldButton) => {
        const newButton = currentlyPressed
          .find(({
            idx,
          }) => idx === oldButton.idx);

        // If the old button was pressed and the new one is not, it's depressed :(
        if (oldButton.pressed && !newButton) {
          registeredChanges.push({
            pad: padIndex,
            button: oldButton.idx,
            pressed: false,
          });
        }
      });

      // For all the buttons that are currently pressed on this frame, loop through
      // and determine if it was in the 'pressed' state in the last frame
      currentlyPressed.forEach((newButton) => {
        const oldButton = (lastPressedButtons[padIndex] || [])
          .find(({
            idx,
          }) => idx === newButton.idx);

        // If there is no "old button", that means this button was freshly pressed
        // on this frame
        if (!oldButton) {
          registeredChanges.push({
            pad: padIndex,
            button: newButton.idx,
            pressed: true,
          });
        }
      });

      // Save this frame's state
      lastPressedButtons[padIndex] = currentlyPressed;
    }); // End gamepad loop

    // For each change (button was pressed, button was released, etc), loop through
    // and notify the nES6 instance accordingly. Reads from `keyMap` to determine
    // what joypad button the gamepad input maps to.
    registeredChanges.forEach((change) => {
      const {
        pad,
        button,
        pressed,
      } = change;

      const method = pressed ? 'pressControllerButton' : 'depressControllerButton';

      // Some buttons may not be bound to the joypad
      if (keyMap[button]) {
        nesInstance[method](pad, keyMap[button]);
      } else {
        throw new Error(`No gamepad mapping found for button "${button}"`);
      }
    });

    // Poll gamepads all over again!
    root.requestAnimationFrame(pollGamepads(nesInstance));
  };

/**
 * Binding function for bindGamepad plugin. Given an nES6 instance,
 * gamepads are tracked from the browser, and button presses
 * are translated into joystick inputs within nES6.
 *
 * @param  {nES6}   nesInstance   Active nES6 instance to bind to.
 * @return {void}
 */
export default function (customKeyMap) {
  if (customKeyMap) {
    checkMapCompleteness(customKeyMap);
    keyMap = { ...customKeyMap };
  }

  return (nesInstance) => {
    // Event bindings to kick off polling
    root.addEventListener('gamepadconnected', pollGamepads(nesInstance), false);
    root.addEventListener('gamepaddisconnected', pollGamepads(nesInstance), false);

    // ...and a manual poll to pick up gamepads that are already connected
    pollGamepads(nesInstance)();

    // Return the nES6 instance for chaining.
    return nesInstance;
  };
}
