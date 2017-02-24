import NES from './NES.js';

const App = new NES();
App.start();


const roms = ['PunchOut', 'SuperMarioBros', 'SuperMarioBros3', 'Earthbound', 'MegaMan'];

let romToLoad;
const getIndex = ()=>{
	const numRands = 20;
	let randIndex = 0;
	for(let i = 0; i < numRands; i++){
		randIndex += (Math.random() * 10);
	}
	randIndex = Math.floor(randIndex / numRands);

	romToLoad = roms[randIndex];
}

while (!romToLoad) {
	getIndex();
}

App.loadRomFromUrl(`/roms/${romToLoad}.nes`);

