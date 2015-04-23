/* ===========================================

Файл который проверяет, была ли начата игра

1. Игра уже уже была начата и выбрали кнопку продолжить
2. Кнопка начать игру заново, если игра уже была начата, обновить модальные окна 

============================================ */


;(function gameStarted() {

	if ( localStorage.getItem('info') ) {

		var currentGame = JSON.parse(localStorage.getItem('info')),
			gameStartWrap = document.querySelector('[data-gamestart]'),
			gameStartedWrap = document.querySelector('[data-game-restart-wrap]'),
			continueButton = document.querySelector('[data-game-continue]');

		gameStartWrap.classList.add('visibility');
		gameStartedWrap.classList.add('active');

		continueButton.addEventListener('mousedown', function (event) {

			GAME = currentGame;
			gameInit();
			gameStartedWrap.classList.remove('active');

		});


	}

})();


;(function restartGame() {

	var restartButtons = document.querySelectorAll('[data-game-restart]'),
		gameStartWrap = document.querySelector('[data-gamestart]'),
		gameStartModals = document.querySelectorAll('[data-gamestart-modal]'),
		gameRestartWrap = document.querySelector('[data-game-restart-wrap]');

	bindListeners(restartButtons, 'mousedown', function (event, element) {

		localStorage.removeItem('info');
		var attr = element.getAttribute('data-game-restart');

		if ( attr = 'resetModals' )
			resetModals();

		resetGAME();
		gameStartWrap.classList.remove('visibility', 'hidden');
		gameRestartWrap.classList.remove('active');


		[].forEach.call(gameStartModals, function (element, index, array) {

			element.classList.remove('active', 'hidden');

			if ( index === 0 ) {
				element.classList.add('active');
			}

		});

	});

})();



;function resetModals() {

	var gameStartHtml = localStorage.getItem('gamestartHTML');

	document.querySelector('[data-gamestart]').innerHTML = gameStartHtml;

	gameStartView();
	gameStartLogic();
	gameStartRubricSelect();

};

;function resetGAME() {

	GAME = {
		players: [],
		playersM: [],
		playersF: [],
		currentPlayer: {},
		targetPlayer: {},
		rubrics: [],
		actions: [],
		truth: [],
		json: {}
	}


};