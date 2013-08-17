var io = require('socket.io');
var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var objClients = {},
	top = null,
	left = null;

io.sockets.on('connection', function (socket) {
	var idUser = socket.id;
	top = Math.floor(Math.random() * 451);
	left = Math.floor(Math.random() * 451);

	socket.emit('hi', { id:idUser , numImage:1, postionTop: top, postionTop: left, others: objClients});

	socket.broadcast.emit('newUser', { id: idUser, numImage:1, postionTop: top, postionTop: left});

	objClients[idUser]={numImage:1, postionTop: top, postionTop: left};


	socket.on('messageSent', function (data) {
		io.sockets.emit('messageReceived', { mes: data.mes, id:data.id});
	});

	socket.on('move', function (data) {
		io.sockets.emit('villageMove', data);
	});

	socket.on('stop', function (data) {
		console.log(data);
		io.sockets.emit('villageFixed', data);
	});

	socket.on('disconnect', function () {
    	io.sockets.emit('userDisconnected', {id:idUser});
    	objClients[idUser]=null;
  	});
});
console.log(3000);
server.listen(3000);

