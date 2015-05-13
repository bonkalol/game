/* =====================================

Проверка игры, рандомый выбор правды или действие,
проверка изменилось ли кол-во правды и действия в GAME

// 1. Рандомный выбор правды или действия
// 2. Проверка действительно ли изменилось кол-во правды и действия

===================================== */



;function gamePlayTest() {


	var loopTime = GAME.actions.length,
		actions = [],
		truth = [],
		currentPlayerTest = null,
		buttons = document.querySelectorAll('[data-showmodal-button]');

	for (var i = 1; i < loopTime; i++) {

		var truthLenght = GAME.truth.length,
			actionsLength = GAME.actions.length,
			length = [truthLenght, actionsLength],
			random = getRandomInt(0, 1);

		// 1.
		if ( !buttons[random].classList.contains('disabled') ) {

			triggerEvent('mousedown', buttons[random]);
			triggerEvent('mousedown', document.querySelector('[data-game-modalclose-button]'));
			check(buttons[random], length);

		}

		else {

			random = random === 1 ? 0 : 1;
			triggerEvent('mousedown', buttons[random]);
			triggerEvent('mousedown', document.querySelector('[data-game-modalclose-button]'));
			check(buttons[random], length);

		}

	}

	// 2.
	function check(button, length) {

		var attr = button.getAttribute('data-showmodal-button');

		if ( attr === 'truth' && length[0] - 1 === GAME.truth.length ) {

			truth.push(true);
			return true;

		} else if ( length[0] !== GAME.truth.length ) {

			truth.push(false);

		}

		if ( attr === 'actions' && length[1] - 1 === GAME.actions.length ) {

			actions.push(true);
			return true;

		} else if ( length[0] !== GAME.truth.length ) {

			actions.push(false);

		}

	};

	var actionsStatus = actions.every( function (element, index, array) {

		if ( element === true ) return true;
		else return false;

	});

	var truthStatus = truth.every( function (element, index, array) {

		if ( element === true ) return true;
		else return false;

	});


	if ( actionsStatus === true && truthStatus === true ) {

		TEST.results.push(Object.create(Results).constructor('Game give question or actions', 'success'));

	} else {

		TEST.results.push(Object.create(Results).constructor('Game give question or actions', 'fail'));

	}


};