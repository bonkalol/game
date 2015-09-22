/* ========================================

Файл отвечает за рендер и работу модальных окон при начале игры
Логика начала игры расположена в ../logic/game_start.js
Рендер шаблоны TEMPLATES расположен в TEMPLATES.js

1. gameStartView(); - функция которая отвечает за переключение (вперед/назад) модальных окон
1.1. Кнопка "Далее", если нет больше модальных окон, то закрыть "Начало игры"
1.2. Кнопка "Назад", пролистывает окна назад
1.3. Клик по кнопке начало игры, инициализация игры

2. playerAdd(); - Добавление игрока в облако игроков, отвечает только за рендер html

3. Удаление игрока

4. Выбор рубрики

========================================== */


// 1.
;function gameStartView() {


	var gameStartModals = document.querySelectorAll('[data-gamestart-modal]'),
		gameStartNextButtons = document.querySelectorAll('[data-gamestart-nextmodal]'),
		gameStartWrap = document.querySelectorAll('[data-gamestart]'),
		gameStartBackButtons = document.querySelectorAll('[data-gamestart-prevmodal]'),
		gameStartStartGame = document.querySelector('[data-gamestart-start]'),
		gameStartNextModal = null,
		gameStartPrevModal = null,
		currentModal = null;

	// Next button
	// 1.1.
	bindListeners(gameStartNextButtons, 'mousedown', function (event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartNextModal = currentModal.nextSibling;

		// hide current modal
		currentModal.classList.add('hidden');
		// show next modal
		gameStartNextModal.classList.add('active');

	});

	// Prev button
	// 1.2.
	bindListeners(gameStartBackButtons, 'mousedown', function (event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartPrevModal = currentModal.previousSibling;

		// hide current modal
		currentModal.classList.remove('active');
		// show next modal
		gameStartPrevModal.classList.remove('hidden');

	});

	// 1.3.
	gameStartStartGame.addEventListener('mousedown', function(event) {

		gameStartClose();

	});


};

// call game start view
;(function callGameStart() {
	gameStartView();
})();


// 2.
;function gameStartPlayerAdd(name, gender, input) {

	var gameStartPlayersContainer = document.querySelector('[data-gamestart-playerContainer]');

	if (gameStartCheckPlayerExist(input)) {
		// player exist
		// throw error here
		return;
	}

	gameStartPlayersContainer.insertAdjacentHTML('beforeend', TEMPLATES.gameStartCreatePlayer(gender, name));

	if (checkPlayers()) {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');
	} else {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');
	}


};

;function checkPlayers() {
	return (document.querySelectorAll('[data-gamestart-player]').length >= 2 &&
	 document.querySelectorAll('[data-gamestart-player-gender="m"]').length >= 1 &&
	 document.querySelectorAll('[data-gamestart-player-gender="f"]').length >= 1);
};


// 3.
;function gameStartPlayerDelete(sender) {

	var gameStartPlayersContainer = document.querySelector('[data-gamestart-playerContainer]'),
		playerName = sender.innerText || sender.textContent,
		playerGender = sender.getAttribute('data-gamestart-player-gender');

	GAME.players = GAME.players.filter(function (element, index, array) {
		return element.name !== playerName;
	});

	GAME['players' + playerGender.toUpperCase()] = GAME['players' + playerGender.toUpperCase()].filter(function (element, index, array) {
		return element.name !== playerName;
	});

	sender.remove();

	if (checkPlayers()) {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');
	} else {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');
	}

};

;(function () {

	document.addEventListener('mousedown', function (event) {
		if (event.target.hasAttribute('data-gamestart-player-remove')) {
			gameStartPlayerDelete(event.target.parentNode);
		}
	}, false);

})();


// 4.
;function gameStartRubricSelect() {

	var checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	bindListeners(checkboxes, 'change', function (event, element) {
		// reset Rubrics
		GAME.rubrics = [];

		if (isChecked(checkboxes))
			element.closest('[data-gamestart-modal]').querySelector('[data-rubricselect-modal-button]').removeAttribute('data-disabled');
		else
			element.closest('[data-gamestart-modal]').querySelector('[data-rubricselect-modal-button]').setAttribute('data-disabled', '');

		// update picked rubrics
		[].forEach.call(checkboxes, function (element, index, array) {

			if (element.checked)
				GAME.rubrics.push(element.value);

		});

	});

	function isChecked(elements) {

		var isCheckboxCheked = false;

		[].some.call(elements, function (element, index, array) {

			if (element.checked) {
				isCheckboxCheked = true;
				return false;
			}

		});

		if (isCheckboxCheked)
			return true;
		else
			return false;

	};

};


;(function gameStartRubricSelectCall() {

	gameStartRubricSelect();

})();