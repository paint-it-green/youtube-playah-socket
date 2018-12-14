var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
  	socket.join(syncRoom);
  	io.to('holder-room').emit('requestSync', syncRoom);
  })

  socket.on("grantSync", function(data) {
  	io.sockets.in(data.room).emit('grantSync', data.playlist);
  })

  socket.on("getCurrent", function() {
  	io.to('holder-room').emit('getCurrent', syncRoom);
  })

  socket.on('suggestVideo', function(youtubeData) {
  	io.to('holder-room').emit('suggestVideo', youtubeData);
  });

  socket.on('holderRoom', function() {
  	socket.join('holder-room');
  })

  socket.on('addVideo', function(youtubeData){
  	io.sockets.emit('addVideo', youtubeData);
  });

  socket.on('setCurrent', function(obj) {
  	if(obj.room) {
  		io.sockets.in(obj.room).emit('setCurrent', obj);
  		return;
  	}
  	else {
	  	io.sockets.emit('setCurrent', obj);
  	}
  })

  socket.on('clear', function(obj) {
  	io.sockets.emit('clear', obj);
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});