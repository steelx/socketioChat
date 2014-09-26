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
    var collection = db.collection('messages');

    var sendStatus = function(s){
      socket.emit('status', s);
    };
    //Wait for input from frontend
    socket.on('userinput', function(data){
      var name = data.name,
          message = data.message,
          whitespacePattern = /^\s*$/;

      if(whitespacePattern.test(name) || whitespacePattern.test(message)){
        console.log('Invalid! Cannot insert empty string.');
        sendStatus('Invalid! Name or Message cannot be empty.');
      } else {
        collection.insert({name: name, message: message}, function(){
          console.log('data inserted into db.');
        });
      }

    });
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
