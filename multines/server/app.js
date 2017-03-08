// server/app.js
const WebSocket = require('ws');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Websockets
io.on('connection', (socket) =>{
	// when the client emits 'new message', this listens and executes
	socket.on('input:down', (data) => {
		socket.broadcast.emit('input:down', data);
	});

	socket.on('input:up', (data) => {
		socket.broadcast.emit('input:up', data);
	});
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

server.listen(process.env.PORT || 9000);

module.exports = app;
