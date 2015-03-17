/* ==============================

UPDATE PLAYERS INPUTS ( MALE, FEMALE, ALL )

================================ */

function updatePlayers(type) {

	var $cloud = $('.players-cloud-main'),
		male = [],
		female = [],
		all = [],
		$inputM = $('#players-m'),
		$inputF = $('#players-f'),
		$inputAll = $('#players-all');

	// if game only starting
	if (type === 'game-start') {

		$cloud = $('.game-start_player-cloud');

	}

	// find players in cloud
	var $players = $cloud.find('.game-start_player');

	// define players gender type
	$.each($players, function() {

		var val;
			val = $(this).text().replace(/ /g,'');

		if ( $(this).attr('data-player-gender') === 'm' ) {
			male.push(val);
		}

		if ( $(this).attr('data-player-gender') === 'f' ) {
			female.push(val);
		}

		all.push(val);

	});

	// update inputs values
	$inputM.val(male.toString());
	$inputF.val(female.toString());
	$inputAll.val(all.toString());

}

/* ==============================

UPDATE RUBRICS

================================ */


function updateRubrics(type) {

	var $inputs = $('[name="rubric-select-main"]'),
		rubrics = [],
		$inputRubric = $('#game-rubric');

	if (type === 'game-start') {

		$inputs = $('[name="new-game-rubric"]');

	}
	// find checked rubrics
	$.each($inputs, function() {

		if ( $(this).prop('checked') === true ) {
			rubrics.push($(this).val());
		}

	});
	// update input
	$inputRubric.val(rubrics.toString());

}

/* ==============================

CLICK EVENT TO UPDATE INPUTS

================================ */


$( function() {

	$('[data-update-inputs]').on('mousedown', function() {

		if ( $(this).hasClass('game-start_next') ) {

			updatePlayers('game-start');
			updateRubrics('game-start');
			return;

		}

		// update inputs values
		updatePlayers();

	});

});

