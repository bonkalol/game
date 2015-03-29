

$(function () {

	// game start

	// init
	var $gameStartModals = $('.game-start_modal'),
		$gameStartNextModal = $('.game-start_next'),
		$gameStart = $('.game-start'),
		$gameStartBackModal = $('.game-start_back');

	// click on next modal
	$gameStartNextModal.on('mousedown', function (event) {

		// if new player create, check new_player.js
		if ( $(this).closest('.game-start_modal').hasClass('new-player-create') ) {
			saveDataStorage();
			updatePlayers('game-start');
			// add players in main cloud
			updateMainPlayersCloud();
			$(this).closest('.game-start').addClass('hidden visibility');
			return;
		}

		// find next game-start_modal
		var $closestModal = $(this).closest('.game-start_modal').next();

		// if modal exist
		if ( $closestModal.length && $closestModal.hasClass('game-start_modal') ) {
			// hide this modal and show next
			$(this).closest('.game-start_modal').addClass('hidden');
			$closestModal.addClass('active');

		}
		// if modal isn't exist
		else {
			// add class hidden to game start
			$gameStart.addClass('hidden');
			// time out opacity animation
			var timeOutHide = setTimeout(function () {

				$gameStart.addClass('visibility');

			}, 600);

			// update players in header
			ENV.gameStarted = true;
			// save state in localstorage
			saveDataStorage();
			// add players in main cloud
			updateMainPlayersCloud();
			// update current player
			$('.player_item').eq(0).addClass('active');
		}

	});

	// click on back modal
	$gameStartBackModal.on('mousedown', function(event) {

		// find next game-start_modal
		var $closestModal = $(this).closest('.game-start_modal').prev();

		if ( $closestModal.length && $closestModal.hasClass('game-start_modal') ) {
			// hide this modal and show next
			$(this).closest('.game-start_modal').removeClass('active');
			$closestModal.removeClass('hidden');

		}

	});

	// cloud update

	// on item delete
	$('body').on('click', '.game-start_player', function() {

		$(this).remove();
		checkPlayersValue();

	});

	// add player item
	$('.game-start_input--players').on('keydown', function(event) {

		if ( event.keyCode === 13 && $(this).val().length >= 2) {

			addNewPlayerCloud($(this).val());
			$(this).val('');

		}

	});

	// submit button
	$('.game-start_submit-player').on('mousedown', function() {

		var e = jQuery.Event('keydown');
		e.keyCode = 13;
		$('.game-start_input--players').trigger(e);

	});
	// create new player
	function addNewPlayerCloud(text) {

		// define gender
		var gender = '',
			$playerCloud = $('.game-start_player-cloud'),
			status = true;
		$.each($('.game-start_player'), function() {

			if ( text.replace(/ /g,'') === $(this).text().replace(/ /g,'') ) {
				status = false;
			}

		});

		// find checked gender
		$.each($('[name="new-player-gender"]'), function() {

			if ($(this).prop('checked') === true) {
				gender = $(this).val();
				return false;
			}

		});

		if (gender === '' || status === false) {
			return;
		}

		if (gender === 'm') {
			$playerCloud.append('<span class="game-start_player game-start_player--male" data-player-gender="m">' + text + '<span class="game-start_player-remove"><\/span><\/span>');
		}

		if (gender === 'f') {
			$playerCloud.append('<span class="game-start_player game-start_player--female" data-player-gender="f">' + text + '<span class="game-start_player-remove"><\/span><\/span>');
		}

		checkPlayersValue();

	}

	// button disable/enable
	function checkPlayersValue() {
		if ( $('.game-start_player').length >= 2 ) {
			$('.game-start_next--players').removeAttr('data-disabled');
			return true;
		} else {
			$('.game-start_next--players').attr('data-disabled', '');
			return false;
		}
	}

	// check rubrics
	function checkRubrics() {
		var status = false;

		$.each($('[name="new-game-rubric"]'), function() {

			if ( $(this).prop('checked') === true ) {
				status = true;
				return false;
			}

		});

		if ( status === true ) {
			$('.game-start_next--rubrics').removeAttr('data-disabled');
			return true;
		} else {
			$('.game-start_next--rubrics').attr('data-disabled', '');
			return false;
		}
	}

	$('[name="new-game-rubric"]').on('change', function() {

		checkRubrics();

	});

});