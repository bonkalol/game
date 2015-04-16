/* =============================

Отвечает за показ модального окна и выдачей в него html вопроса/действия

1. Вешаем эвент листенеры на кнопки выбора правды или действия
2. Выбираем правду или действие, выбранный вопрос удаляем из массива, если
вопросы или действие кончились, обновляем
3. Определяем тип карточки
3.1. Знак +, надо выбрать игрока противоположного пола и подставить как цель
3.2. Знак #, серая карточка, не читать задание в слух и выполнять действие чтобы игроки не догадывались
3.3. Знак ;, серая карточка, коллективное задание - выполняют все
4. Показываем модальное окно с выбранным вопросом, действием
5. Добавление вопроса, действия в стрик
6. Проверка доступности вопросов/действий

============================= */

// 1.
;(function buttonEvents() {

	var truthButton = document.querySelector('[data-truth-button]'),
		actionButton = document.querySelector('[data-action-button]'),
		closePopupButton = document.querySelector('[data-game-modalclose-button]');


		truthButton.addEventListener('mousedown', function(event) {

			getTruthOrAction('truth');

		});

		actionButton.addEventListener('mousedown', function(event) {

			getTruthOrAction('actions');

		});

		closePopupButton.addEventListener('mousedown', function(event) {

			closeModal();

		});




})();

// 2.
;function getTruthOrAction(type) {

	var content = '',
		min = 0,
		random = null;
		// get random question
		random = getRandomInt(min, GAME[type].length - 1);
		content = GAME[type][random];
		GAME[type].splice(random, 1);

		if ( type === 'truth' ) {

			addStreak(type);
			console.log(GAME.currentPlayer, 'picked ' + type);

			if ( GAME.truth.length === 0 )
				updateTruth();
		}

		if ( type === 'actions' ) {

			addStreak(type);
			console.log(GAME.currentPlayer, 'picked ' + type);

			if ( GAME.actions.length === 0 )
				updateAction();
		}

		showModal(content, type);

};

// 3.
;function cardType(text) {

	var symbol = text.slice(text.length, 1);

	switch(symbol) {

		case '+': {

		}
		break;

		case '#': {

		}
		break;

		case ';': {

		}
		break;
	}

}


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

	if (truthCount === max)
		status = {truth: false, actions: true};

	if (actionsCount === max)
		status = {truth: true, actions: false};

	else if (truthCount !== max && actionsCount !== max)
		status = {truth: true, actions: true};

	// console.log(status);
	return status;

};