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
;function gameStartLogic() {

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

			SavePlayers(document.querySelectorAll('[data-gamestart-player]'), 'data-gameStart-player-gender');

		});


};

;(function gameStartLogicCall() {

	gameStartLogic();

})();

// 2.
;function SavePlayers(players, playersGenderAttr) {

	var gameStartPlayers = players,
		playerName = '',
		playerGender = '';

	// player Proto
	var Player = {
		constructor: function (name, gender) {
			this.name = name;
			this.gender = gender;
			this.actionsStreak = 0;
			this.truthStreak = 0;
			this.isCurrentPlayer = false;
			return this;
		}
	}

	// reset GAME.player for rewrite
	GAME.players = [];
	GAME.playersF = [];
	GAME.playersM = [];

	// update GAME.players
	[].forEach.call(gameStartPlayers, function (element, index, array) {

		playerName = element.innerText || element.textContent;
		playerGender = element.getAttribute(playersGenderAttr);

		// create new player
		player = Object.create(Player).constructor(playerName, playerGender);
		// sort player
		GAME.players.push(player);
		GAME['players' + player.gender.toUpperCase()].push(player)

	});

};

// 3.
;function gameStartCheckPlayerExist(input) {

	var isExist = false;

	isExist = GAME.players.some( function (element, index, array) {

		if (element.name === input.value) {
			return true;
		}

	});

	return isExist;

};


// 4.
;function gameStartClose() {

	var gameStartWrap = document.querySelector('[data-gamestart]'),
		timeout = null,
		lastModal = document.querySelectorAll('[data-gamestart-modal]');


	gameStartWrap.classList.add('hidden');
	lastModal[lastModal.length - 1].classList.add('hidden');

	timeout = setTimeout(function() {

		gameStartWrap.classList.add('visibility');

	}, 600);

	getJson();

};