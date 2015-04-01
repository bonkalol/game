/* ==============================

UPDATE PLAYERS INPUTS ( MALE, FEMALE, ALL )

================================ */

function updatePlayers(type) {

	var $cloud = $('.players-cloud-main'),
		male = [],
		female = [],
		all = [],
		allGender = [],
		$inputM = $('#players-m'),
		$inputF = $('#players-f'),
		$inputAll = $('#players-all'),
		$players = null;

	// if game only starting
	if (type === 'game-start') {

		$cloud = $('.game-start_player-cloud');
		$players = $cloud.find('.game-start_player');

	} else {
		// find in main cloud
		$players = $cloud.find('.player_item').not('.player_item--new');

	}

	// find players in cloud

	// define players gender type
	$.each($players, function() {

		var val;
			val = $(this).text().replace(/ /g,'');

		if ( $(this).attr('data-player-gender') === 'm' ) {
			male.push(val);
			allGender.push(val + '.M');

		}

		if ( $(this).attr('data-player-gender') === 'f' ) {
			female.push(val);
			allGender.push(val + '.F');

		}

		all.push(val);

	});

	// update global
	ENV.playersM = male;
	ENV.playersF = female;
	ENV.players = all;
	ENV.playersGender = allGender;
	ENV.playersCount = all.length;

	// update inputs values
	$inputM.val(male.toString());
	$inputF.val(female.toString());
	$inputAll.val(all.toString());
	saveDataStorage();

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
	ENV.rubrics = rubrics;

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

