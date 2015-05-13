/* ==================================

Тест начала игры, выбор рубрики

1. Рандомный выбор рубрики

=================================== */

// 1.
;function testRubricSelect() {

	var pick = getRandomInt(0, 2),
		checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	[].forEach.call(checkboxes, function (element, index, array) {

		element.checked = false;

	});

	[].forEach.call(checkboxes, function (element, index, array) {

		if (pick >= index) {

			element.checked = true;
			triggerEvent('change', element);

		}

	});

	if ( GAME.rubrics.length === pick.toArrayLength() ) {

		TEST.results.push(Object.create(Results).constructor('GAME.rubrics.length', 'success'));
		triggerEvent('mousedown', document.querySelector('[data-rubricselect-modal-button]'));

	} else {

		TEST.results.push(Object.create(Results).constructor('GAME.rubrics.length', 'fail'));

	}


};