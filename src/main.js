import NES from './NES.js';

const App = new NES();
App.start();

// ROM courtesy of TecmoBowl.org
const romToLoad = 'TecmoSuperBowl2k17';

App.loadRomFromUrl(`/roms/${romToLoad}.nes`);

