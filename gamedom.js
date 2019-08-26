var GameDOM = function() {
  this.defaultState = "login"
  this.state = this.defaultState

  this.scrollToBottom = function(el) {
    el.scrollTop = el.scrollHeight;
  }

  this.setState = function(state) {
    this.state = state
    document.body.className = ""
    document.body.classList.add(state)
  }

  this.updateGamesList = function(games) {
    var gamesWrapper = document.getElementById("games")
    if(games.length)
      gamesWrapper.innerHTML = ""
    else
      gamesWrapper.innerHTML = "<p>No Available Games</p>"

    games.forEach(function(game) {
      var gameEntry = document.createElement("div")
      var gameName = document.createElement("span")
      gameName.innerHTML = game.name
      var gameId = document.createElement("span")
      gameId.classList.add("hidden")
      gameId.innerHTML = game.id
      var gamePlayers = document.createElement("span")
      gamePlayers.dataset.playerIds = ""
      gamePlayers.innerHTML = (game.players.length ? game.players.length : "0") + "/4 ("
      game.players.forEach(function(p,i) {
        var isMe = (localStorage.getItem("dominion_userid") == p.id) ? "me" : ""
        gamePlayers.innerHTML += (i == 0 ? "<span class='"+isMe+"'>" : ", <span class='"+isMe+"'>" ) + p.name + "</span>"
        gamePlayers.dataset.playerIds += p.id + ","
      })
      gamePlayers.innerHTML += ")"
      gameEntry.appendChild(gameName)
      gameEntry.appendChild(gamePlayers)
      gameEntry.appendChild(gameId)
      gamesWrapper.append(gameEntry)
    })
  }

  this.updateBoard = function() {
    document.getElementById("game").className = game.gameState.state

    var currentPlayer = game.gameState.players.find(a => a.playerUid == game.gameState.currentPlayerId)
    var me = game.gameState.players.find(a => a.me)
    document.getElementById("myDrawDeck").innerHTML = ""
    document.getElementById("myHand").innerHTML = ""
    document.getElementById("topDrawDeck").innerHTML = ""
    document.getElementById("topHand").innerHTML = ""
    document.getElementById("leftDrawDeck").innerHTML = ""
    document.getElementById("leftHand").innerHTML = ""
    document.getElementById("rightDrawDeck").innerHTML = ""
    document.getElementById("rightHand").innerHTML = ""

    document.getElementById("leftDrawDeck").dataset.playerName = ""
    document.getElementById("rightDrawDeck").dataset.playerName = ""
    document.getElementById("topDrawDeck").dataset.playerName = ""

    document.querySelectorAll("[data-player-id]").forEach(d => d.classList.remove("current"));
    document.body.classList.remove("myTurn")

    for(var i = 0; i < me.drawDeck; i++) {
      var card = document.createElement("div")
      document.getElementById("myDrawDeck").appendChild(card)
    }
    for(var i = 0; i < me.hand.length; i++) {
      var card = document.createElement("div")
      card.classList.add(me.hand[i].id)
      card.tabIndex = -1;
      if(me.hand[i].playable) {
        var button = document.createElement("div")
        card.appendChild( button )
      }
      document.getElementById("myHand").appendChild(card)
      document.getElementById("player").dataset.playerId = me.playerUid
      if(currentPlayer && currentPlayer.playerUid == me.playerUid) {
        document.getElementById("player").classList.add("current")
        document.body.classList.add("myTurn")
      }

      // document.getElementById("gameMessage").innerHTML = me.playedCards.
    }
    if(game.gameState.players.length >= 2) {
      var left = game.gameState.players[(game.gameState.players.indexOf(me) + 1) % game.gameState.players.length]
      for(var i = 0; i < left.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("leftDrawDeck").appendChild(card)
      }
      for(var i = 0; i < left.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("leftHand").appendChild(card)
      }
      document.getElementById("leftDrawDeck").dataset.playerName = left.name
      document.getElementById("leftPlayer").dataset.playerId = left.playerUid
      if(currentPlayer && currentPlayer.playerUid == left.playerUid)
        document.getElementById("leftPlayer").classList.add("current")

      document.getElementById("leftDiscardDeck").className = ""
      if(left.discardDeck)
        document.getElementById("leftDiscardDeck").className = (left.discardDeck.id)

    }
    if(game.gameState.players.length >= 3) {
      var top = game.gameState.players[(game.gameState.players.indexOf(me) + 2) % game.gameState.players.length]
      for(var i = 0; i < top.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("topDrawDeck").appendChild(card)
      }
      for(var i = 0; i < top.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("topHand").appendChild(card)
      }
      document.getElementById("topDrawDeck").dataset.playerName = top.name
      document.getElementById("topPlayer").dataset.playerId = top.playerUid
      if(currentPlayer && currentPlayer.playerUid == top.playerUid)
        document.getElementById("topPlayer").classList.add("current")

      document.getElementById("topDiscardDeck").className = ""
      if(top.discardDeck)
        document.getElementById("topDiscardDeck").className = (top.discardDeck.id)

    }
    if(game.gameState.players.length >= 4) {
      var right = game.gameState.players[(game.gameState.players.indexOf(me) + 3) % game.gameState.players.length]
      for(var i = 0; i < right.drawDeck; i++) {
        var card = document.createElement("div")
        document.getElementById("rightDrawDeck").appendChild(card)
      }
      for(var i = 0; i < right.hand; i++) {
        var card = document.createElement("div")
        card.classList.add("card_blank")
        document.getElementById("rightHand").appendChild(card)
      }
      document.getElementById("rightDrawDeck").dataset.playerName = right.name
      document.getElementById("rightPlayer").dataset.playerId = right.playerUid
      if(currentPlayer && currentPlayer.playerUid == right.playerUid)
        document.getElementById("rightPlayer").classList.add("current")

      document.getElementById("rightDiscardDeck").className = ""
      if(right.discardDeck)
        document.getElementById("rightDiscardDeck").className = (right.discardDeck.id)
    }

    // Rebuild Chat Window
    document.getElementById("messages").innerHTML = ""
    game.gameState.chat.forEach(function(chat) {
      var el = document.createElement("div")
      el.innerHTML = chat.message
      el.dataset.name = chat.name
      document.getElementById("messages").appendChild( el )
    })
    this.scrollToBottom(document.getElementById("messages"))

    document.getElementById("myDiscardDeck").className = ""
    if(me.discardDeck)
      document.getElementById("myDiscardDeck").className = (me.discardDeck.id)

    game.gameState.market.forEach(function(card, i) {
      document.getElementById("buyk" + i).innerHTML = "<div data-cost="+card.cost+" data-name='"+card.name+"'class='"+card.id+"'></div>"
    })

    // Update Stats
    document.getElementById("buys").innerHTML = me.buysRemaining
    document.getElementById("actions").innerHTML = me.actionsRemaining
    document.getElementById("gold").innerHTML = me.goldRemaining
    document.getElementById("buysGoldRemaining").innerHTML = me.goldRemaining
    document.getElementById("goldInHand").innerHTML = me.hand.map(c => c.value).filter(c => c).reduce((a,b) => a + b, 0)

    document.getElementById("userName").innerHTML = localStorage.getItem("dominion_username")
    document.getElementById("myDrawDeck").dataset.playerName = localStorage.getItem("dominion_username")
    document.getElementById("gameName").innerHTML = game.gameState.name
    console.log(game.gameState)
  }
}
