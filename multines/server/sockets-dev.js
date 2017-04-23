var LZString = require('lz-string');
var sizeof = require('object-sizeof');
var md5 = require('md5');

var io = require('socket.io')({
	transports: ['websocket'],
});

var serialize = function(obj) {
	return LZString.compressToUTF16(JSON.stringify(obj));
};

var deserialize = function(str) {
	return JSON.parse(LZString.decompressFromUTF16(str));
};

// var nES6 = require('../../src/nES6.js');

// var nes = new nES6({
// 	render: 'headless',
//     audio: false,
// });

var fs = require('fs');
var path = require('path');
let romData;
// const rom = '../../app/roms/TecmoSuperBowl2k17.nes';
const romName = 'Super Mario Bros.';
const romPath = path.resolve(__dirname, '../../src/roms/SuperMarioBros.nes');
console.log(`Loading ${romPath}...`);
fs.readFile(romPath, (err, data) => {
  if (err) {
    throw err;
  }
  console.log('\tROM loaded!', `${data.toString().length / 1000} KB`);
  romData = data;
});

var firstPlayer;
var clients = {};
var clientOrder = [];

var sentBandwidth = 0;
var receivedBandwidth = 0;

var getNumClients = () => clientOrder.length;

var emitTo = (socket, action, data, summary, broadcast)=>{
	const compressedData = serialize(data);
	const originalSize = (sizeof(data) + sizeof(action)) / 1000;
	const outgoingSize = (sizeof(compressedData) + sizeof(action)) / 1000;
	const audienceSize = broadcast ? getNumClients() - 1 : 1;
	sentBandwidth += outgoingSize;

	console.log(`
${summary || 'Emitting data...'}
MD5:\t${!!data ? md5(compressedData) : ''}
Original size:\t${originalSize} KB
Compressed size:\t${outgoingSize} KB
Audience count:\t${audienceSize}
Outgoing: ${outgoingSize * audienceSize} KB

TOTAL INBOUND: ${receivedBandwidth.toFixed(2)} KB
TOTAL OUTBOUND: ${sentBandwidth.toFixed(2)} KB
`);

	socket.emit(action, compressedData);
};

io.on('connection', (socket) =>{
	clients[socket.id] = socket;
	clientOrder.push(socket.id);

	if (!firstPlayer || !firstPlayer.connected) {
		firstPlayer = socket;

		((firstPlayer)=>{
			setInterval(()=>{
				if (getNumClients() - 1 > 0){
					firstPlayer && emitTo(firstPlayer, 'state:request', null, 'Requesting: P1 State');
				}
			}, 2500);
		})(socket);
	}

	socket.on('disconnect', ()=>{
		if (!firstPlayer || firstPlayer.id === socket.id) {
			firstPlayer = null

			if (clientOrder.length > 1){
				var nextId = clientOrder.shift();
				firstPlayer = clients[nextId];
				console.log('new first player', nextId);
			}
		}
		delete clients[socket.id];
	});

	console.log('connected', socket.id);
	if(romData) {
		emitTo(socket, 'rom:data', { rom: romData, name: romName }, 'Sending ROM data');
	}

	// when the client emits 'new message', this listens and executes
	socket.on('input:down', (data) => {
		receivedBandwidth += sizeof(data) / 1000;
		if (firstPlayer && firstPlayer.id !== socket.id) {
			return;
		}
      	// this.nes.pressControllerButton(0, joypadButton);
      	emitTo(socket.broadcast, 'input:down', data, 'Emitting input:down', true);
	});

	socket.on('input:up', (data) => {
		receivedBandwidth += sizeof(data) / 1000;
		if (firstPlayer && firstPlayer.id !== socket.id) {
			return;
		}

      	// this.nes.depressControllerButton(0, joypadButton);
      	emitTo(socket.broadcast, 'input:up', data, 'Emitting input:up', true);
	});

	socket.on('state:update', (state)=>{
		receivedBandwidth += sizeof(state) / 1000;
		if (getNumClients() - 1 <= 0) {
			return;
		}

      	emitTo(socket.broadcast, 'state:update', state, 'Emitting state:update', true);
	});
});

io.listen(3001, ()=>{
	console.log('socket server listening at ws://localhost:3001');
});
