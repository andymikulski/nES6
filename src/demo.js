import nES6 from './nES6.js';
import bindKeyboardPlugin from './plugins/bindKeyboard';
import bindGamepadPlugin from './plugins/bindGamepad';
import dragDropPlugin from './plugins/dragDropLoader';

const App = new nES6({
  render: 'auto',
	// audio: false,
  plugins: [
    bindGamepadPlugin(),
    bindKeyboardPlugin(),
    dragDropPlugin(),
  ],
});
App.start();

// ROM courtesy of TecmoBowl.org!
const romToLoad = 'TecmoSuperBowl2k17';
App.loadRomFromUrl(`/roms/${romToLoad}.nes`);
