/* ===================================

1. Выбор игрока, который выполняет ход

===================================== */


;function nextPlayer() {

	var isNoOneActive = true,
		playerName = '',
		playerOutput = document.querySelector('[data-picked-player]');

	GAME.players.every( function (element, index, array) {

		if (element.isCurrentPlayer === true) {
			// set isCurrentPlayer to false
			// set to next element isCurrentPlayer true
			GAME.players[index].isCurrentPlayer = false;
			isNoOneActive = false;

			if ( GAME.players[index + 1] ) {
				// set to next isCurrentPlayer Active
				GAME.players[index + 1].isCurrentPlayer = true;
				GAME.currentPlayer = GAME.players[index + 1];
				playerName = GAME.currentPlayer.name;
			}

			else {
				// set to first isCurrentPlayer Active
				GAME.players[0].isCurrentPlayer = true;
				GAME.currentPlayer = GAME.players[0];
				playerName = GAME.currentPlayer.name;
			}

			return false;

		}

		return true;

	});

	if (isNoOneActive) {
		// set isCurrentPlayer to true first player
		GAME.players[0].isCurrentPlayer = true;
		playerName = GAME.players[0].name;
	}

	// write in html player name
	playerOutput.innerHTML = playerName + ' ';


};