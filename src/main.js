import nES6 from './nES6.js';

const App = new nES6({
	render: 'auto', // 'auto', 'canvas', 'webgl', 'headless'
});
App.start();

// ROM courtesy of TecmoBowl.org
const romToLoad = 'TecmoSuperBowl2k17';

App.loadRomFromUrl(`/roms/${romToLoad}.nes`);
