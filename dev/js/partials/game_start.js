

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

});