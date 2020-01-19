var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    io.emit('chat message', msg);
//  });
//});

http.listen(port, function(){
  console.log('listening on *:' + port);
});


var players = {};
var rooms = [];
rooms[0] = {// add an example starter room
    id: 'randomId236512',
    name: 'Happy Box House Room',
    players: [],
    started: false,
    setCount: 0
};

function findOpenRoom() {
    //here you would search through the list of games waiting for players
    //if no rooms, make one, add it to the list, then return it
    return rooms[0];
}

io.on('connection', function (socket) {

  var newPlayer = {//A better pratice would be create a "class" or new function for the Player object
      name: 'Mr. Jones',
      color: 'blue',
      currentRoom: null,
      requestedSets: [],//or could just be NumRequestedSets
      //Whatever additional game related data could go here
      //Alternately, if the data is specific to the whole game, put it on the room itself
  };
  console.log('socket id ---2222 p--- ',socket.id)
  players[socket.id] = newPlayer;//Adding this to the players dictionary will let us find the player object again via their socket id

  var openRoom = findOpenRoom();
 // console.log(openRoom)
  newPlayer.currentRoom = openRoom; //Now the player object has a reference to the game room it's in
  openRoom.players.push(newPlayer);
  socket.join(openRoom.id);//This will create a new socket.io channel to make it easy to emit to a single room

  socket.on('startGame', function (msg) {
    console.log('socketid====',socket.id)
    console.log(msg)
      var myRoom = players[socket.id].currentRoom;
      myRoom.started = true;
      myRoom.setCount = 0;//Ensure 0 at start
      //Broadcast the startGame message here,  see below for building gamestate
  });
  socket.on('chat message', function(msg){
    console.log('log chat message listener',msg)   
     console.log('socketid---',socket.id) 
      
    console.log('chat message event parameters ',msg)
    var myRoom = players[socket.id].currentRoom;
    var gameState = {'test':123}
    socket.broadcast.to(myRoom.id).emit('setWasRequested', gameState);
  });
  socket.on('requestSet', function (msg) {

      sendSetOfBoxes(players[socketId]);//Respond to the message here, update the requested set number or whatever

      var gameState = {
          playerData: []
      };
      var myRoom = players[socketId].currentRoom;
      for (var i = 0; i < myRoom.players.length; i++) {
          //Loop over the players, and build a list of players and their history of requested sets
          gameState.playerData.push({
              name: myRoom.players[i].name,
              requestedSetHistory: myRoom.player[i].requestedSets
          })
      }
      socket.broadcast.to(myRoom.id).emit('setWasRequested', gameState);
  });
  function sendSetOfBoxes(player) {
      //do your sending of boxes here
  }
});


setInterval(function() {
  //console.log(rooms[0])
},3000)