/* =======================================

Рендер новых игроков в облако игроков

========================================= */


function updateMainPlayersCloud() {

	var container = document.querySelector('[data-game-players-container]'),
		containerNewPlayer = container.querySelector('[data-game-newplayer]'),
		htmlString = '';

		GAME.players.forEach( function (element, index, array) {

			htmlString += TEMPLATES.player(element.gender, element.name);

		});

		containerNewPlayer.insertAdjacentHTML('beforeend', htmlString);

}