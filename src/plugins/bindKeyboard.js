/**
 * nES6 plugin to bind keyboard events to joypads. Defaults to a 'sensible' key
 * mapping, but also allows for overriding any/all of the map.
 *
 * Example:

import bindKeyboardPlugin, { KEYMAP_DEFAULTS } from './plugins/bindKeyboard';
const App = new nES6({
  plugins: [
    bindKeyboardPlugin({
      customKeyMap: {
        ...KEYMAP_DEFAULTS,
        // assign custom keys - here, we swap the left/right arrows
        // keyCode: 'BUTTON',
        39: 'LEFT',
        37: 'RIGHT',
      },
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
export const KEYMAP_DEFAULTS = {
  90: 'A', // Z
  88: 'B', // X
  67: 'SELECT', // C
  13: 'START', // Enter
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
};

/**
 * Configurable keyboard mapping object, based on KEYMAP_DEFAULTS.
 * @type {Object}
 */
export let keyMap = { ...KEYMAP_DEFAULTS };

/**
 * Checks given key map and determines if there are keys left unbound.
 * Displays console warnings if there is a missing binding.
 *
 * @param  {Object} map   Key map to inspect
 * @return {void}
 */
const checkMapCompleteness = (map)=>{
  const values = Object.keys(map).map((binding)=>{
    return map[binding];
  });

  joypadButtons.forEach((button)=>{
    if (values.indexOf(button) === -1){
      console && console.warn(`"${button}" button missing on given keymap.`);
    }
  })
}

/**
 * Binding function for bindKeyboard plugin. Given an nES6 instance,
 * event bindings are added to the window, which 'presses' a joypad controller
 * inside of nES6. Refers to `keyMap` for bindings - which can be overridden.
 *
 * @param  {nES6}   nesInstance   Active nES6 instance to bind to.
 * @return {void}
 */
export default function(options = {}){
  if (options.customKeyMap) {
    checkMapCompleteness(options.customKeyMap);
    keyMap = { ...options.customKeyMap };
  }

  return (nesInstance)=>{
    window.addEventListener('keydown', (event) => {
      if (keyMap[event.keyCode]) {
        event.preventDefault();
        const playerNum = event.shiftKey ? 1 : 0;
        const joypadButton = keyMap[event.keyCode];

        if(options.onPress){
          options.onPress({ playerNum, joypadButton })
        }
        nesInstance.pressControllerButton(playerNum, joypadButton);
      }
    }, false);

    window.addEventListener('keyup', (event) => {
      if (keyMap[event.keyCode]) {
        event.preventDefault();
        const playerNum = event.shiftKey ? 1 : 0;
        const joypadButton = keyMap[event.keyCode];

        if(options.onDepress){
          options.onDepress({ playerNum, joypadButton })
        }
        nesInstance.depressControllerButton(playerNum, joypadButton);
      }
    }, false);

    // Return the nES6 instance for chaining.
    return nesInstance;
  }
}
