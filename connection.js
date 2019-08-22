var Server = function(options) {

  this.socket = io.connect(SERVER_URL);

  this.join = function(name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit('playerJoined')
    this.socket.emit("gameList")
    gameUI.setState("gameList")
  };

  this.rejoin = function(id, name) {
    this.socket.emit('playerConnected', name);
    this.socket.emit('playerRejoined', id);
    this.socket.emit("gameList")
    gameUI.setState("gameList")
  };

  this.getGameList = function(name) {
    this.socket.emit("gameList")
  }

  this.sendChat = function(message) {
    this.socket.emit("createChat", '{"id": \"' + localStorage.getItem("dominion_gameId") + '", "message": "' + btoa(message) + '"}')
    console.log('{"id": \"' + localStorage.getItem("dominion_gameId") + '", "message": "' + btoa(message) + '"}')
  }

  this.createGame = function(name) {
    this.socket.emit('createGame', name);
  }

  this.startGame = function(gameId) {
    this.socket.emit('startGame', gameId);
  }

  this.endTurn = function() {
    this.socket.emit('endTurn', localStorage.getItem("dominion_gameId"));
  }

  this.playCard = function(cardName) {
    this.socket.emit('playCard', JSON.stringify({cardName: cardName, gameId: localStorage.getItem("dominion_gameId")}));
  }

  this.joinGame = function(gameId) {
    this.socket.emit('joinGame', gameId)
    localStorage.setItem("dominion_gameId", gameId)
  }

  this.requestRejoinGame = function(gameId) {
    this.socket.emit('requestRejoinGame', gameId)
    localStorage.setItem("dominion_gameId", gameId)
  }

  this.leaveGame = function(gameId) {
    this.socket.emit('leaveGame', gameId)
    localStorage.removeItem("dominion_gameId")
    gameUI.setState("gameList")
  }

  this.socket.on('welcome', function(playerData) {
    console.log(playerData)
    var data = JSON.parse(playerData)
    localStorage.setItem("dominion_userid", data.id)
    localStorage.setItem("dominion_username", data.name)
  })

  this.socket.on('gameList', function(data) {
    gameUI.updateGamesList(data)
  })

  this.socket.on('gameJoin', function(gameId) {
    localStorage.setItem("dominion_gameId", gameId)
  })

  this.socket.on('gameEnded', function(data) {
    localStorage.removeItem("dominion_gameId")
  })

  this.socket.on('gameStart', function() {
    localStorage.removeItem("dominion_gameId")
  })

  this.socket.on('gameState', function(data) {
    if(gameUI.state != "game")
      gameUI.setState("game")
    game.gameState = JSON.parse(data)
    gameUI.updateBoard()
  })
}
