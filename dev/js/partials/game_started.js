
$(function() {

	if (localStorage.getItem('info') !== null) {
		// hide game start
		$('.game-start').addClass('visibility');
		// show game restart
		$('.game-restart').addClass('active');

		// add event
		$('.game-restart-true').on('click', function(event) {


			ENV = JSON.parse(localStorage.getItem('info'));
			$('.game-restart').removeClass('active');
			// init
			updateRubricsChecked();
			updateMainPlayersCloud();
			next();

		});

		$('.game-restart-false').on('click', function(event) {
			// new game
			// remove key
			localStorage.removeItem('info');
			// remove classes
			$('.game-restart').removeClass('active');
			$('.game-start').removeClass('visibility hidden');

		});


	} else {
		$('.game-restart').removeClass('active');
	}

});