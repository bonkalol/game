/* ==================================================

Тест интерфейса и логики начала игры

================================================== */



;function testAddPlayersView() {

	console.log('======= Starting game start add players view test.');

	var playersArray = [
		{name: 'Миша', gender: 'm'},
		{name: 'Света', gender: 'f'},
		{name: 'Вика', gender: 'f'},
		{name: 'Богдан', gender: 'm'},
		{name: 'Лена', gender: 'f'},
		{name: 'Тимур', gender: 'm'}
	];

	var input = document.querySelector('[data-gamestart-playerinput]'),
		checkF = document.querySelector('#new-player-f'),
		checkM = document.querySelector('#new-player-m');

	playersArray.forEach( function (element, index, array) {

		input.value = element.name;

		if ( element.gender === 'f' ) {
			checkF.checked = true;
		}

		if ( element.gender === 'm' ) {
			checkM.checked = true;
		}

		triggerEvent('change', document.querySelector('#new-player-' + element.gender));
		triggerEvent('mousedown', document.querySelector('[data-gamestart-playeradd]'));

	});

	if ( document.querySelectorAll('[data-gamestart-player-gender]').length === 6 &&
		document.querySelectorAll('[data-gamestart-player-gender="f"]').length === 3 &&
		document.querySelectorAll('[data-gamestart-player-gender="m"]').length === 3 ) {
		TEST.results.push(Object.create(Results).constructor('Game start creating players test', 'succes'));
	} else {
		TEST.results.push(Object.create(Results).constructor('Game start creating players test', 'fail'));
	}

	console.log('======= Finishing game start add players view test.');

};


;function testAddPlayersLogic() {

	if (GAME.players.length === 6 && GAME.playersF.length === 3 && GAME.playersM.length === 3) {
		TEST.results.push(Object.create(Results).constructor('GAME.players.length Test', 'success'));
	} else {
		TEST.results.push(Object.create(Results).constructor('GAME.players.length Test', 'fail'));
	}

};