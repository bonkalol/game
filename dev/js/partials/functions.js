/* =========================================

functions.js - включает в себя различные вспомогательные функции


1. disableElements(); - Выключает все неактивные елементы
2. saveGameState(); - Сохранение текущего состояния игры

=========================================== */


// 1
;(function disableElements() {

	// disable all elements
	var disabledItems = document.querySelectorAll('[data-disabled]');

	bindListeners(disabledItems, 'mousedown', function(event) {
		event.preventDefault();
	});

})();




// 2
function saveGameState() {


	function localStorageTest() {

		var test = 'test';

		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch(e) {
			return false;
		}

	}


	if (localStorageTest()) {
		localStorage.setItem('info', JSON.stringify(GAME));
	} else {
		return;
	}

};

$(function() {

	$('[data-next-player]').on('mousedown', function() {
		next();
	});

});




function updateRubricsChecked() {

	$.each($('[name="new-game-rubric"]'), function() {

		var value = $(this).val(),
			$this = $(this);

		ENV.rubrics.forEach(function(element, index, array) {

			if (value === element) {
				$this.prop('checked', true);
			}

		});

	});

}

function updateQandAENV() {

	var json = JSON.parse(localStorage.getItem('json'));

	ENV.q = [];
	ENV.a = [];

	$.each(json, function(i, v) {

		// find rubrics rubrics
		ENV.rubrics.some(function(element, index, arrya) {

				if (i === element) {
					addQA(i, v);
				}

		});


	});
}

$(function () {

	var $rubric = $('.game-rubric');

	$('[data-toggle-rubric]').on('click', function(event) {

		event.preventDefault();

		if ($rubric.hasClass('active')) {
			ENV.rubrics = [];
			$.each($rubric.find('input'), function() {

				if ($(this).prop('checked') === true) {
					ENV.rubrics.push($(this).val());
				}

			});

			$rubric.removeClass('active');
			updateQandAENV();
			saveDataStorage();

		} else {
			$rubric.addClass('active');
			updateRubricsChecked();
		}


	});

});




$(function () {

	var $menu = $('.sidebar'),
		$content = $('.main'),
		$header = $('.header');

	$('[data-toggle-menu], .sidebar_link').on('click', function(event) {

		$header.toggleClass('active');
		$menu.toggleClass('active');
		$content.toggleClass('active');

	});

});

