if(! localStorage.getItem("dominion_userid")) {
  gameUI.setState("login")
} else {
  server.rejoin(localStorage.getItem("dominion_userid"), localStorage.getItem("dominion_username"))
  if(localStorage.getItem("dominion_gameId")) {
    server.requestRejoinGame(localStorage.getItem("dominion_gameId"))
  }
}

document.querySelector("#login .button").addEventListener("click", function() {
  var username = document.querySelector("#login input").value
  server.join(username)
})

document.querySelector("#gameList .button").addEventListener("click", function() {
  gameUI.setState("addNewGame")
})

document.querySelector("#addNewGame .button.cancel").addEventListener("click", function() {
  gameUI.setState("gameList")
})

document.querySelector("#addNewGame .button.create").addEventListener("click", function() {
  var gamename = document.querySelector("#addNewGame input").value
  server.createGame(gamename)
  gameUI.setState("game")
})

document.querySelector("#waiting .button").addEventListener("click", function() {
  server.startGame(localStorage.getItem("dominion_gameId"))
})

document.querySelector("#games").addEventListener("click", function(e) {
  var entry = e.target.closest("#games > div")
  var gameId = entry.querySelector("span.hidden").textContent
  if(document.querySelector("#games > div span[data-player-ids]").dataset.playerIds.indexOf( localStorage.getItem("dominion_userid") ) > -1)
    server.requestRejoinGame(gameId)
  else
    server.joinGame(gameId)
  gameUI.setState("game")
})

document.querySelector("#logout").addEventListener("click", function(e) {
  server.leaveGame(localStorage.getItem("dominion_gameId"))
  server.getGameList()
})

document.querySelector("#lobby").addEventListener("click", function(e) {
  localStorage.removeItem("dominion_gameId")
  server.getGameList()
  gameUI.setState("gameList")
})

document.querySelector("#finishedLobby").addEventListener("click", function(e) {
  localStorage.removeItem("dominion_gameId")
  server.getGameList()
  gameUI.setState("gameList")
})

document.getElementById("compose").addEventListener("keydown", function(e) {
  if(e.keyCode == 13) {
    server.sendChat( document.querySelector("#compose input").value )
    document.querySelector("#compose input").value = ""
  }
})

document.getElementById("send").addEventListener("click", function(e) {
  server.sendChat( document.querySelector("#compose input").value )
  document.querySelector("#compose input").value = ""
})

document.getElementById("endTurn").addEventListener("click", function(e) {
  server.endTurn( )
})

document.getElementById("buysEndTurn").addEventListener("click", function(e) {
  document.getElementById("game").classList.remove("market");
  server.endTurn( )
})

document.getElementById("playAllTreasure").addEventListener("click", function(e) {
  server.playAllTreasure( localStorage.getItem("dominion_gameId") )
})

document.getElementById("marketTrigger").addEventListener("click", function(e) {
  document.getElementById("game").classList.add("market");
})

document.getElementById("myHand").addEventListener("click", function(e) {
  var isPlayButton = e.target.closest("#myHand > div > div")
  if(isPlayButton) {
    var card = e.target.closest("#myHand > div")
    server.playCard(card.className)
  }
})

document.getElementById("market").addEventListener("click", function(e) {
  document.querySelectorAll(".selected-market-card").forEach(function(e) {
    e.classList.remove("selected-market-card")
  })
  var card = e.target.closest("#market > div:not(#preview) > div")
  if(card) {
    var name = card.dataset.name
    card.classList.remove("selected-market-card")
    cardId = card.className
    card.classList.add("selected-market-card")
    document.querySelector("#completePurchase span").innerHTML = (name ? name : "")
    document.getElementById("completePurchase").classList.remove("disabled")
    document.getElementById("previewCard").innerHTML = "<div class='"+cardId+"'></div>"
    document.getElementById("purchaseError").innerHTML = ""
  }
  else {
    document.getElementById("completePurchase").classList.add("disabled")
    document.getElementById("previewCard").innerHTML = "<div class='card_back'></div>"
    document.querySelector("#completePurchase span").innerHTML = ""
  }
})

document.getElementById("completePurchase").addEventListener("click", function(e) {
  if(e.target.classList.contains("disabled")) return
  var gold = parseInt(document.querySelector("#gold").innerText)
  var buys = parseInt(document.querySelector("#buys").innerText)
  var card = document.querySelector(".selected-market-card")
  var cost = parseInt(card.dataset.cost)
  card.classList.remove("selected-market-card")
  if(cost > gold) {
    document.getElementById("purchaseError").innerHTML = "<p>Not enough gold!</p>"
  }
  else if( buys <= 0 ) {
    document.getElementById("purchaseError").innerHTML = "<p>Not enough Buys left!</p>"
  }
  else {
    server.buyCard(card.className)
  }
})

document.getElementById("closeMarket").addEventListener("click", function(e) {
  document.getElementById("game").classList.remove("market");
})
