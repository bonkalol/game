

$(function () {

	// game start

	// init
	var $gameStartModals = $('.game-start_modal'),
		$gameStartNextModal = $('.game-start_next'),
		$gameStart = $('.game-start'),
		$gameStartBackModal = $('.game-start_back');

	// click on next modal
	$gameStartNextModal.on('mousedown', function (event) {

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
	$('body').on('mousedown', '.game-start_player', function() {

		$(this).remove();

	});

	// add item
	$('.game-start_input--players').on('keydown', function(event) {

		if ( event.keyCode === 13 && $(this).val().length >= 2) {

			addNewPlayerCloud($(this).val());
			$(this).val('');

		}

	});

	// UX
	$('[name="new-player-gender"]').on('click', function() {

		$('.game-start_input--players').focus();

	});

	// submit button
	$('.game-start_submit-player').on('mousedown', function() {

		var e = jQuery.Event('keydown');
		e.keyCode = 13;
		$('.game-start_input--players').trigger(e);

	});

	function addNewPlayerCloud(text) {

		// define gender
		var gender = '',
			$playerCloud = $('.game-start_player-cloud');

		// find checked gender
		$.each($('[name="new-player-gender"]'), function() {

			if ($(this).prop('checked') === true) {
				gender = $(this).val();
				return false;
			}

		});

		if (gender === '') {
			return;
		}

		if (gender === 'm') {
			$playerCloud.append('<span class="game-start_player game-start_player--male" data-player-gender="m">' + text + '<span class="game-start_player-remove"><\/span><\/span>');
		}

		if (gender === 'f') {
			$playerCloud.append('<span class="game-start_player game-start_player--female" data-player-gender="f">' + text + '<span class="game-start_player-remove"><\/span><\/span>');
		}

	}

});