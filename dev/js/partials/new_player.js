

$(function () {

	var $trigger = $('.player_item--new'),
		$gameStart = $('.game-start'),
		$modal = $('.game-start_modal--first');

	$trigger.on('click', function(event) {

		$('.game-start_modal--fourth').css({
			'visibility': 'hidden'
		});

		if ( $('.game-start_player-cloud').children().length === 0 ) {

			// update game start cloud
			$.each($('.players-cloud-main .player_item'), function() {

				var name = $(this).text();

				if ( $(this).hasClass('player_item--male') ) {
					$('.game-start_player-cloud').append('<span class="game-start_player game-start_player--male" data-player-gender="m">' + name + '<span class="game-start_player-remove"><\/span><\/span>');
				}

				if ( $(this).hasClass('player_item--female') ) {
					$('.game-start_player-cloud').append('<span class="game-start_player game-start_player--female" data-player-gender="f">' + name + '<span class="game-start_player-remove"><\/span><\/span>')
				}

			});

			$('.game-start_next--players').removeAttr('data-disabled');


		}

		// update html
		$modal.addClass('new-player-create');
		$modal.find('.game-start_next--players').text('Ок');
		$modal.find('.game-start_header').text('Новый игрок');

		// update visibility
		$modal.removeClass('hidden');
		$gameStart.removeClass('visibility hidden');

	});

});