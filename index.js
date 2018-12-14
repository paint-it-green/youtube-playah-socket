var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  transports  : [ 'websocket' ],
  pollingDuration : 10
});

var port = process.env.PORT || 5000;


app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){

  var syncRoom = new Date().getTime();
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on("requestSync", function() {
    console.log("request sync")
  	socket.join(syncRoom);
  	io.to('holder-room').emit('requestSync', syncRoom);
  })

  socket.on("grantSync", function(data) {
    console.log("grant sync")
  	io.sockets.in(data.room).emit('grantSync', data.playlist);
  })

  socket.on("getCurrent", function() {
    console.log("get current")
  	io.to('holder-room').emit('getCurrent', syncRoom);
  })

  socket.on('suggestVideo', function(youtubeData) {
    console.log("suggest video")
  	io.to('holder-room').emit('suggestVideo', youtubeData);
  });

  socket.on('holderRoom', function() {
    console.log("holder room")
  	socket.join('holder-room');
  })

  socket.on('addVideo', function(youtubeData){
    console.log("add video")
  	io.sockets.emit('addVideo', youtubeData);
  });

  socket.on('setCurrent', function(obj) {
    console.log("set current")
  	if(obj.room) {
  		io.sockets.in(obj.room).emit('setCurrent', obj);
  		return;
  	}
  	else {
	  	io.sockets.emit('setCurrent', obj);
  	}
  })

  socket.on('clear', function(obj) {
    console.log("clear")
  	io.sockets.emit('clear', obj);
  })

});

http.listen(port, function(){
  console.log('listening on *:5000');
});