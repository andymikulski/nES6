/**
 * KeyboardEvent keyCodes and their corresponding gamepad button.
 * @type {Object}
 */
export const keyMapDefaults = {
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
 * Configurable keyboard mapping object, based on keyMapDefaults.
 * @type {Object}
 */
export let keyMap = { ...keyMapDefaults };

/**
 * Binding function for bindKeyboard plugin. Given an nES6 instance,
 * event bindings are added to the window, which 'presses' a gamepad controller
 * inside of nES6. Refers to `keyMap` for bindings - which can be overridden.
 *
 * @param  {nES6} 	nesInstance 	Active nES6 instance to bind to.
 * @return {void}
 */
export default function(nesInstance){
	window.addEventListener('keydown', (event) => {
		if (keyMap[event.keyCode]) {
			event.preventDefault();
			nesInstance.pressControllerButton(event.shiftKey ? 1 : 0, keyMap[event.keyCode]);
		}
	}, false);

	window.addEventListener('keyup', ({keyCode}) => {
		if (keyMap[keyCode]) {
			event.preventDefault();
			nesInstance.depressControllerButton(event.shiftKey ? 1 : 0, keyMap[keyCode]);
		}
	}, false);

	// Return the nES6 instance for chaining.
	return nesInstance;
}
