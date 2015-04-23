/* =======================================

Рендер новых игроков в облако игроков

========================================= */


function updateMainPlayersCloud() {

	var container = document.querySelector('[data-game-players-container]'),
		htmlString = '',
		players = document.querySelectorAll('[data-game-player]');

		if ( players ) {

			[].forEach.call(players, function (element, index, array) {

				element.remove();

			});

		}

		GAME.players.forEach( function (element, index, array) {

			htmlString += TEMPLATES.player(element.gender, element.name);

		});

		container.insertAdjacentHTML('afterbegin', htmlString);

}