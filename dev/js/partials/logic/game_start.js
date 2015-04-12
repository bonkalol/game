/* =============================================

Этот файл отвечает за логику начала игры, например
эвенты связанные с добавлением игроков, загрузка json...

1. gameStartLogic(); - функция обрабатывающая начало игры.
1.1. Выбор половой принаджлености и запись в переменную выбраного пола
1.2. Нажатие на кнопку добавить, добавление игрока в облако игроков, вызов рендер функции playerAdd(...);

2. gameStartSavePlayers(); - сохранение игроков в переменную GAME.players

3. Проверка, был ли добавлен такой игрок

4. Закрываем game_start, качаем json, инициализируем игру

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

				gameStartPlayerAdd(gameStartPlayerInput.value, gameStartPlayerGender, gameStartPlayerInput);
				gameStartPlayerInput.value = '';

			}

			gameStartSavePlayers();

		});


})();

// 2.
;function gameStartSavePlayers() {

	var gameStartPlayers = document.querySelectorAll('[data-gamestart-player]'),
		playerName = '',
		playerGender = '';

	// reset GAME.player for rewrite
	GAME.players = [];

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

// 3.
;function gameStartCheckPlayerExist(input) {

	var isExist = false;

	GAME.players.some( function (element, index, array) {

		if (element.name === input.value) {
			isExist = true;
			return false;
		}

	});

	if (isExist === true) {
		return true;
	} else {
		return false;
	}

};


// 4.
;function gameStartClose() {

	var gameStartWrap = document.querySelector('[data-gamestart]'),
		timeout = null;

	gameStartWrap.classList.add('hidden');

	timeout = setTimeout(function() {

		gameStartWrap.classList.add('visibility');

	}, 600);

	getJson();

};