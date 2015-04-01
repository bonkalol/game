$(function() {

	// latin letter in input
	$('[data-latin-only]').on('keyup', function(event) {

		$(this).val($(this).val().replace(/[^a-z ]/i, ""));

	});
	// latin letter in input
	$('[data-latin-only]').on('paste', function(event) {
		event.preventDefault();
		// prevent paste
		return false;
	});

	// disabled button
	$('[data-disabled]').on('mousedown', function(event) {

		event.preventDefault();
		return false;

	});


});



function saveDataStorage() {

	if(typeof(Storage) !== 'undefined') {
		localStorage.setItem('info', JSON.stringify(ENV));
	} else {
		return;
	}

};


function updateMainPlayersCloud() {

	var $cloud = $('.players-cloud-main');

	$cloud.find('.player_item').not('.player_item--new').remove();

	ENV.playersGender.forEach(function(element, index, arr) {

		var value = element.slice(0, element.length - 2);
			gender = element.slice(element.length - 1, element.length).toLowerCase();

		if (gender === 'm') {
			$cloud.prepend('<div class="player_item player_item--male"><div class="player_item_avatar player_item_avatar--male"><svg width="22px" height="22px"><use xlink:href="#business"><\/use><\/svg><\/div><div class="player_item_name">' + value + '<\/div><\/div>');
		}

		if (gender === 'f') {
			$cloud.prepend('<div class="player_item player_item--female"><div class="player_item_avatar player_item_avatar--female"><svg width="22px" height="22px"><use xlink:href="#woman"><\/use><\/svg><\/div><div class="player_item_name">' + value + '<\/div><\/div>');
		}


	});

}

$(function() {

	$('[data-next-player]').on('mousedown', function() {
		next();
	});

});

function getRandomInt(min, max) {

	return Math.floor(Math.random()*(max + 1 - min)) + min;

}




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

