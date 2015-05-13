/* ========================================

Тест инициализации игры

======================================== */

;function gameLogicInitTest() {

	var rulesModal = document.querySelector('[data-rules-modal]'),
		rulesNextButton = rulesModal.querySelector('[data-gamestart-nextmodal]'),
		startButton = document.querySelector('[data-gamestart-start]');

	triggerEvent('mousedown', rulesNextButton);
	triggerEvent('mousedown', startButton);

	if ( GAME.truth.length > 1 &&
		GAME.actions.length > 1 &&
		GAME.game === true &&
		GAME.gameState === 1) {

		TEST.results.push(Object.create(Results).constructor('Game init logic', 'success'));

	} else {

		TEST.results.push(Object.create(Results).constructor('Game init logic', 'fail'));

	}

};


;function gameViewInitTest() {

	var gamePlayersContainer = document.querySelector('[data-game-players-container]'),
		playersF = gamePlayersContainer.querySelectorAll('player_item--female[data-game-player]'),
		playersM = gamePlayersContainer.querySelectorAll('player_item--male[data-game-player]');

		if (!playersF.length === 3 || !playersM.length === 3) {

			TEST.results.push(Object.create(Results).constructor('Game init render player', 'fail'));
			return;

		} else {

			TEST.results.push(Object.create(Results).constructor('Game init render player', 'success'));

		}

};