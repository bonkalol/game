/* ===============================================

	Тестирование работы game-list

=============================================== */


;function testGameList() {

	var listItemShowTrigger = document.querySelector('[data-show-game-list]'),
		gameList = document.querySelector('[data-game-list]');

/*

	переменная которая хранит промежуточный результат теста

*/

	var test = {
		opened: null,
		checkAll: null,
		updateTruth: null,
		updateAction: null
	};

/*

	Тригерим эвент, проверяем состояние gameList контейнера

*/

	triggerEvent('mousedown', listItemShowTrigger);

	if ( gameListStateGet() === 0 ) {

		var timeOut = setTimeout(function () {

			if ( checkIsOpened )
				test.opened = true;
			else
				test.opened = false;

			selectDeselect();

		}, 2400);

		var timeOut2 = setTimeout(function() {

			checkUpdateGame();

		}, 3000);

	}

	;function checkIsOpened() {

		if ( gameList.classList.contains('visible') )
			return true;
		else
			return false;

	};

	;function selectDeselect() {

		var actionButton = document.querySelector('[data-select-action]'),
			wrap = actionButton.closest('[data-game-list-item-wrap]'),
			items = wrap.querySelectorAll('[data-game-list-item]');

		// double click
		for (var i = 0; i < 2; i++) {

			var action = actionButton.getAttribute('data-select-action');
			triggerEvent('mousedown', actionButton);

			var result = [].every.call(items, function (element, index, array) {

				if ( action === 'select' )
					return element.classList.contains('js-checked');
				else if ( action === 'deselect' )
					return !element.classList.contains('js-checked');

			});

			if ( result === true )
				test.checkAll = true;
			else
				test.checkAll = false;

		}

	};

	;function checkUpdateGame() {

		var gameActionsCurrentLength = GAME.actions.length,
			gameTruthCurrentLength = GAME.truth.length,
			saveButton = document.querySelector('[data-game-list-action="save"]'),
			actionContainer = document.querySelector('[data-game-list-wrap$="1"]'),
			actionItem = actionContainer.querySelector('[data-game-list-item].js-checked');

		triggerEvent('click', actionItem);
		triggerEvent('mousedown', saveButton);

		if ( gameActionsCurrentLength !== GAME.actions.length &&
			 gameTruthCurrentLength !== GAME.truth.length ) {

			test.updateTruth = true;
			test.updateAction = true;

		} else {

			test.updateTruth = false;
			test.updateAction = false;

		}

	};

};