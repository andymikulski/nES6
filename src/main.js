import nES6 from './nES6.js';
import bindKeyboardPlugin from './plugins/bindKeyboard';

const App = new nES6({
	render: 'auto',
	audio: true,
	plugins: [bindKeyboardPlugin]
});
App.start();

// ROM courtesy of TecmoBowl.org!
const romToLoad = 'TecmoSuperBowl2k17';
App.loadRomFromUrl(`/roms/${romToLoad}.nes`);
