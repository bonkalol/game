/* ========================================

Файл отвечает за рендер и работу модальных окон при начале игры
Логика начала игры расположена в ../logic/game_start.js

1. gameStartView(); - функция которая отвечает за переключение (вперед/назад) модальных окон
1.1. Кнопка "Далее", если нет больше модальных окон, то закрыть "Начало игры"
1.2. Кнопка "Назад", пролистывает окна назад
1.3. Вызов колбека сохранения игроков в переменную GAME

2. playerAdd(); - Добавление игрока в облако игроков, отвечает только за рендер html

3. Удаление игрока


========================================== */


// 1.
;(function gameStartView() {


	var gameStartModals = document.querySelectorAll('[data-gamestart-modal]'),
		gameStartNextButtons = document.querySelectorAll('[data-gamestart-nextmodal]'),
		gameStartWrap = document.querySelectorAll('[data-gamestart]'),
		gameStartBackButtons = document.querySelectorAll('[data-gamestart-prevmodal]'),
		gameStartNextModal = null,
		gameStartPrevModal = null,
		currentModal = null;

	// Next button
	// 1.1.
	bindListeners(gameStartNextButtons, 'mousedown', function(event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartNextModal = currentModal.nextSibling;

		// if it's a last modal
		if ( gameStartNextModal.length === 0 ) {
			// start game
			gameStartWrap.addClass('visibility');
		}

		else {
			// hide current modal
			currentModal.classList.add('hidden');
			// show next modal
			gameStartNextModal.classList.add('active');
		}

		// 1.3.
		if ( element.getAttribute('data-gamestart-nextmodal-player') !== null && element.getAttribute('data-gamestart-nextmodal-player') !== 'undefined' ) {
			// callback update players
			gameStartSavePlayers();
		}

	});

	// Prev button
	// 1.2.
	bindListeners(gameStartBackButtons, 'mousedown', function(event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartPrevModal = currentModal.previousSibling;

		// hide current modal
		currentModal.classList.remove('active');
		// show next modal
		gameStartPrevModal.classList.remove('hidden');

	});


})();


// 2.
;function playerAdd(name, gender) {

	var gameStartPlayersContainer = document.querySelector('[data-gamestart-playerContainer]');

	if (gender === 'm')
		gameStartPlayersContainer.insertAdjacentHTML('beforeend', '<span class="game-start_player game-start_player--male" data-gameStart-player-gender="m" data-gamestart-player>' + name + '<span class="game-start_player-remove" data-gamestart-player-remove><\/span><\/span>');

	if (gender === 'f')
		gameStartPlayersContainer.insertAdjacentHTML('beforeend', '<span class="game-start_player game-start_player--female" data-gameStart-player-gender="f" data-gamestart-player>' + name + '<span class="game-start_player-remove" data-gamestart-player-remove><\/span><\/span>');

	// update delete binds
	gameStartPlayerDeleteBind();

	if ( document.querySelectorAll('[data-gamestart-player]').length >= 2 ) {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').removeAttribute('data-disabled');

	} else {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').setAttribute('data-disabled', '');

	}


};


// 3.
;function playerDelete(sender) {

	sender.remove();

};