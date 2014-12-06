var http    = require ('http');
var express = require ('express');
var io      = require ('socket.io')(server);

var app     = express();

var wsUri = "ws://ws.blockchain.info/inv";

// this line hooks up express and server
var server  = http.Server(app);

//bring in socket io to and have it listen to server


////////////// ROUTING ///////////////
app.get('/', function(request,response){
  console.log (__dirname);
  response.sendFile(__dirname + '/index.html');
});


///////////////// SOCKET.IO /////////////


////////////// connect to BLOCK CHAIN /////////
// var bC = io.connect("ws://ws.blockchain.info/inv");

// bC.on('connection', function(){
//   console.log('block chain socket connected');
// });




io.on('connection', function(handler) {
  console.log("socketconnected");

  handler.on('message', function(m) {
    console.log('message: ' + m);
    console.log('client is connect to server');

    io.emit('chat', m);

  });
});

server.listen(3000);
console.log("server is running");






// BLOW DOES WHAT EXPRESS() DOES
// var server = http.createServer(function(request, response){
//   response.end(JSON.stringify({name: "bill"}));
// });

// server.listen(9000);