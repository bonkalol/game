

$(function () {

	var $trigger = $('.player_item--new'),
		$gameStart = $('.game-start'),
		$modal = $('.game-start_modal--first');

	$trigger.on('click', function(event) {

		$('.game-start_modal--fourth').css({
			'visibility': 'hidden'
		});


		// update html
		$modal.addClass('new-player-create');
		$modal.find('.game-start_next--players').text('Ок');
		$modal.find('.game-start_header').text('Новый игрок');

		// update visibility
		$modal.removeClass('hidden');
		$gameStart.removeClass('visibility hidden');

	});

});



function newPlayer(name, gender) {



}