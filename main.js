var net = require('net');
var xml2js = require('xml2js');
var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('ya-csv');
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var jsonObj = JSON.parse('{ "values" : []}');

if(process.argv.length > 2) {
    var HOST = process.argv[2];
}
else {
    var HOST = 'localhost';
}
var PORT = 3000;

var myJson;
var values;
var properties = [];

var newData = true;

var parser = new xml2js.Parser({explicitArray : false});

app.use(express.static('public'));

server.listen(3002);

io.on('connection', function (socket) {
    socket.emit('json', jsonObj);
    socket.on('request', function (data) {
        socket.emit('json', jsonObj);
    });
});

net.createServer(function(sock) {
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	sock.on('data', function(data) {
        parser.parseString(data, function (err, result) {
            sock.write('received\n');
            properties = [];
            
            myJson = (JSON.stringify(result));
            var myJsonObj = JSON.parse(myJson);
            
            values = myJsonObj.test;
            for (var prop in values) {
                if(values.hasOwnProperty(prop)) {
                    properties.push(prop);
                }
            }
            
            for (var i = 0; i < properties.length; i++) {
                myJsonObj.test[properties[i]] = parseFloat(myJsonObj.test[properties[i]]);
            }
            
            jsonObj.values.push(myJsonObj.test);
            console.log(JSON.stringify(jsonObj.values, null, 2));
        });
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