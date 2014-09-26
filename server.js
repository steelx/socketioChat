var mongo = require('mongodb').MongoClient;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

mongo.connect('mongodb://127.0.0.1/chat', function(err, db){
  if(err) {throw err;}

  io.on('connection', function(socket){
    console.log('Someone connected!');

    //Wait for input from frontend
    socket.on('chat message', function(msg){
      console.log(msg);
      io.emit('chat message', msg);
    });
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
