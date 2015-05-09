/* =============================

Отвечает за показ модального окна и выдачей в него html вопроса/действия

1. Вешаем эвент листенеры на кнопки выбора правды или действия
2. Выбираем правду или действие, выбранный вопрос удаляем из массива, если
вопросы или действие кончились, обновляем
3. Определяем тип карточки
5. Добавление вопроса, действия в стрик
6. Проверка доступности вопросов/действий

============================= */

// 1.
;(function buttonEvents() {

	var showModalButton = document.querySelectorAll('[data-showmodal-button]');
		closePopupButton = document.querySelector('[data-game-modalclose-button]');


		bindListeners(showModalButton, 'mousedown' , function (event, element) {

			var type = element.getAttribute('data-showmodal-button');

			getTruthOrAction(type);

		});

		closePopupButton.addEventListener('mousedown', function(event) {

			closeModal();

		});




})();

// 2.
;function getTruthOrAction(type) {

	var text = '',
		min = 0,
		random = null;
		// get random question
		random = getRandomInt(min, GAME[type].length - 1);
		text = GAME[type][random];
		GAME[type].splice(random, 1);

		// save current progress in localStorage
		saveGameState();

		if ( type === 'truth' ) {

			addStreak(type);

			if ( GAME.truth.length === 0 )
				updateTruth();
		}

		if ( type === 'actions' ) {

			addStreak(type);

			if ( GAME.actions.length === 0 )
				updateAction();
		}

		// get card type
		var content = cardType(text); 

		// render modal
		showModal(content);

};

// 3.
// Replaced into game_card-type.js

// 5.
;function addStreak(type) {

	[].every.call(GAME.players, function (element, index, array) {

		if (element.isCurrentPlayer) {

			if ( type === 'truth' ) {
				element.truthStreak += 1;
				element.actionsStreak = 0;
			}

			else if ( type === 'actions' ) {
				element.actionsStreak += 1;
				element.truthStreak = 0;
			}

			return false;
		}

		return true;

	});

};

// 6.
;function getCheckedStreak() {

	var status = {},
		max = 2,
		truthCount = 0,
		actionsCount = 0;

	GAME.players.every(function (element, index, array) {

		if (element.isCurrentPlayer) {

			truthCount = element.truthStreak;
			actionsCount = element.actionsStreak;

			return false;
		}

		return true;

	});

	switch(max) {
		case truthCount: {
			status = {truth: false, actions: true};
		}
		break;

		case actionsCount: {
			status = {truth: true, actions: false};
		}
		break;

		default: {
			status = {truth: true, actions: true};
		};
		break;
	}

	return status;

};