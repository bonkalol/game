
$(function() {

	if (localStorage.getItem('info') !== null) {
		// hide game start
		$('.game-start').addClass('visibility');
		// show game restart
		$('.game-restart').addClass('active');

		// add event
		$('.game-restart-true').on('click', function(event) {

			event.preventDefault();


			ENV = JSON.parse(localStorage.getItem('info'));
			$('.game-restart').removeClass('active');
			// init
			updateRubricsChecked();
			updateMainPlayersCloud();
			next();

		});

		$('[data-game-restart]').on('click', function(event) {

			// new game
			// remove key
			localStorage.removeItem('info');
			// remove classes
			$('.game-restart').removeClass('active');
			$('.game-start').removeClass('visibility hidden');

			// if game was started
			resetGameStartDOM();


		});


	} else {
		$('.game-restart').removeClass('active');
	}

});


function resetGameStartDOM() {

	$('.game-start_modal--first').removeClass('new-player-create');
	$('.game-start_modal').not('.game-start_modal--first').removeClass('active hidden');
	$('.game-start_modal--first').removeClass('hidden');
	$('.game-start_modal--first').find('.game-start_next--players').text('Далее');
	$('.game-start_modal--first').find('.game-start_next--players').attr('data-disabled', '');
	$('.game-start_modal--first').find('.game-start_header').text('Добавить игроков');
	$('.game-start_modal--fourth').css({'visibility': 'visible'});
	$('.game-start_player-cloud').empty();
	$('[name="new-game-rubric"]').prop('checked', false);

}