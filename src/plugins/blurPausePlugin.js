import root from 'window-or-global';

/**
 * nES6 plugin to bind a piece of the DOM with drag-n-drop events, which load ROMs
 * into nES6 accordingly.
 *
 * Example:

import blurPausePlugin from './plugins/blurPausePlugin';
const App = new nES6({
  plugins: [
    blurPausePlugin({
      onBlur: ()=>{},
      onFocus: ()=>{},
    })
  ],
});

 */


/**
 * Binding function for blurPausePlugin. Given an nES6 instance,
 * focus/blur event bindings are added to the window, pausing/unpausing the emulator
 * as necessary based on user's focus.
 *
 * @param  {nES6}   nesInstance   Active nES6 instance to bind to.
 * @return {void}
 */
export default function blurPausePlugin(options = {}) {
  return (nesInstance) => {
    root.addEventListener('blur', () => {
      nesInstance.pause(true);
      if (options.onBlur) {
        options.onBlur();
      }
    }, false);

    root.addEventListener('focus', () => {
      nesInstance.pause(false);
      if (options.onFocus) {
        options.onFocus();
      }
    }, false);
  };
}
