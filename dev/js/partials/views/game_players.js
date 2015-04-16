/* =======================================

Рендер новых игроков в облако игроков

========================================= */


function updateMainPlayersCloud() {

	var container = document.querySelector('[data-game-players-container]'),
		htmlString = '';

		GAME.players.forEach( function (element, index, array) {

			htmlString += TEMPLATES.player(element.gender, element.name);

		});

		container.insertAdjacentHTML('afterbegin', htmlString);

}