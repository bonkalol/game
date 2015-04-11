/* =============================================

Этот файл отвечает за логику начала игры, например
эвенты связанные с добавлением игроков, загрузка json...

1. gameStartLogic(); - функция обрабатывающая начало игры.
1.1. Выбор половой принаджлености и запись в переменную выбраного пола
1.2. Нажатие на кнопку добавить, добавление игрока в облако игроков, вызов рендер функции playerAdd(...);
1.3. Удаление игрока, вызов playerDelete(sender);

2. gameStartSavePlayers(); - сохранение игроков в переменную GAME.players


=============================================== */

// 1. 
;(function gameStartLogic() {

	var gameStartPlayerInput = document.querySelector('[data-gamestart-playerInput]'),
		gameStartPlayerButtonAdd = document.querySelector('[data-gamestart-playerAdd]'),
		gameStartPlayerGenderSelect = document.querySelectorAll('[data-gamestart-genderRadio]'),
		gameStartPlayerGender = null;

		// 1.1.
		bindListeners(gameStartPlayerGenderSelect, 'change', function(event, element) {

			if (element.checked)
				gameStartPlayerGender = element.value;

		});

		// 1.2.
		gameStartPlayerButtonAdd.addEventListener('mousedown', function(event) {

			if ( gameStartPlayerInput.value.length >= 2 && gameStartPlayerGender !== null ) {

				playerAdd(gameStartPlayerInput.value, gameStartPlayerGender);
				gameStartPlayerInput.value = '';

			}

		});


})();


;function gameStartPlayerDeleteBind() {

	var gameStartPlayerButtonDelete = document.querySelectorAll('[data-gamestart-player-remove]');
	// 1.3.
	bindListeners(gameStartPlayerButtonDelete, 'click', function(event, element) {

		playerDelete(element.closest('[data-gamestart-player]'));

	});
};


;function gameStartSavePlayers() {

	var gameStartPlayers = document.querySelectorAll('[data-gamestart-player]'),
		playerName = '',
		playerGender = '';
	// reset GAME.player for rewrite
	if (GAME.players.length >= 1) {
		GAME.players = [];
	}

	// update GAME.players
	[].forEach.call(gameStartPlayers, function (element, index, array) {

		playerName = element.innerText || element.textContent;
		playerGender = element.getAttribute('data-gameStart-player-gender');

		var player = {
			name: playerName,
			gender: playerGender,
			actionStreak: 0,
			truthStreak: 0
		}

		GAME.players.push(player);

	});

};