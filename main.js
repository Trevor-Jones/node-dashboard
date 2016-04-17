var net = require('net');
var xml2js = require('xml2js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var jsonfile = require('jsonfile');
var fs = require('fs');
var csv = require('ya-csv');
var path = require('path');

var timeMillis = new Date().getTime();

var voltageCsv = path.join(__dirname, '/logs/voltage/', timeMillis.toString() + '.csv');
console.log(voltageCsv);
var csvFileWriter = csv.createCsvFileWriter(voltageCsv);
var voltage = [];
voltage[0] = 'voltage';
voltage[1] = 'millis';
csvFileWriter.writeRecord(voltage);

var HOST = 'localhost'; // parameterize the IP of the Listen
var PORT = 3000; // TCP LISTEN port

var myJson;
var jsonFile = __dirname + '/tmp/data.json';
var values;
var properties = [];

var parser = new xml2js.Parser({explicitArray : false});

app.use(express.static('public'));
// Create an instance of the Server and waits for a conexão
net.createServer(function(sock) {


  // Receives a connection - a socket object is associated to the connection automatically
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);


  // Add a 'data' - "event handler" in this socket instance
  sock.on('data', function(data) {
	  // data was received in the socket 
	  // Writes the received message back to the socket (echo)
      console.log(data.toString('ascii'));
      parser.parseString(data, function (err, result) {
        myJson = (JSON.stringify(result));
        console.log(JSON.stringify(result, null, 2));
	    sock.write(JSON.stringify(result) + '\n');
        voltage[0]=(JSON.parse(myJson).test.velocity);
        voltage[1]=(JSON.parse(myJson).test.millis);
        csvFileWriter.writeRecord(voltage);
          
        values=JSON.parse(myJson).test;
        for (var prop in values) {
          if(values.hasOwnProperty(prop)) {
            properties.push(prop);
          }
        }
          
        console.log('Done');
        jsonfile.writeFile(jsonFile, myJson, function (err) {
          if(err != null) {
            console.error(err)
          }
        })
      });
  });


  // Add a 'close' - "event handler" in this socket instance
  sock.on('close', function(data) {
	  // closed connection
	  console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });


}).listen(PORT, HOST);

http.listen(3001, function(){
  console.log('listening on *:3001');
});

app.get('/', function(req, res){
  res.sendFile('index.html', { root : __dirname});
});

app.get('/data', function(req, res){
  res.sendFile(jsonFile); 
});

app.get('/data/voltage', function(req, res){
  res.sendFile(voltageCsv); 
});

console.log('Server listening on ' + HOST +':'+ PORT);