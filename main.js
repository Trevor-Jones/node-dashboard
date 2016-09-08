var net = require('net');
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

if(process.argv.length > 2) {
    var HOST = process.argv[2];
}
else {
    var HOST = 'localhost';
}
var PORT = 3000;

var receivedJson;
var receivedData = "{}";
var values;
var properties = [];
var newData = true;

var initialized = false;

app.use(express.static('public'));

server.listen(3002);

io.on('connection', function (socket) {
    console.log('SOCKET.IO CONNECTED');
    socket.emit('json', receivedData);
    socket.on('request', function (data) {
        socket.emit('json', receivedData);
        console.log(data);
    });
});

net.createServer(function(sock) { 
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	sock.on('data', function(data) {
        sock.write('received\n');
        console.log("Received");
        receivedData = data.toString('utf-8');
        newData = true;
        
    });

	sock.on('close', function(data) {
		console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
	});
    
}).listen(PORT, HOST);

app.listen(3001, function(){
	console.log('HTML listening on port 3001');
});

// 	ADVICE: This is sorta dumb: In a typical application, all of the public files
//			are in public/, including the index.html. Not critical to fix, tho
app.get('/', function(req, res){
	res.sendFile('index.html', { root : __dirname});
});

console.log('Java socket server listening on ' + HOST +':'+ PORT);