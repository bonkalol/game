/* ==================================================

Тест интерфейса и логики начала игры

// 1. Переменная которая хранит в себе результаты тестов
	null - не начат
	false - провален
	true - пройден

// 2. Тест на добавления игроков в html код

// 3. Тест на добавление игроков в переменную игры GAME

================================================== */


// 1.
var GAMESTARTTEST = {

	testAddPlayersView: null,
	testAddPlayersLogic: null,
	testRubricSelect: null

};


// 2.
;function testAddPlayersView() {

	var playersArray = [
		{name: 'Миша', gender: 'm'},
		{name: 'Света', gender: 'f'},
		{name: 'Вика', gender: 'f'},
		{name: 'Богдан', gender: 'm'},
		{name: 'Лена', gender: 'f'},
		{name: 'Тимур', gender: 'm'},
		// debug add with same name
		{name: 'Миша', gender: 'm'}
	];

	var input = document.querySelector('[data-gamestart-playerinput]'),
		checkF = document.querySelector('#new-player-f'),
		checkM = document.querySelector('#new-player-m');

	playersArray.forEach( function (element, index, array) {

		input.value = element.name;

		if ( element.gender === 'f' )
			checkF.checked = true;

		if ( element.gender === 'm' )
			checkM.checked = true;

		triggerEvent('change', document.querySelector('#new-player-' + element.gender));
		triggerEvent('mousedown', document.querySelector('[data-gamestart-playeradd]'));

	});

	if ( document.querySelectorAll('[data-gamestart-player-gender]').length === 6 &&
		document.querySelectorAll('[data-gamestart-player-gender="f"]').length === 3 &&
		document.querySelectorAll('[data-gamestart-player-gender="m"]').length === 3 ) {

		TEST.results.push(Object.create(Results).constructor('Game start creating players test', 'succes'));
		GAMESTARTTEST.testAddPlayersView = true;

	} else {

		TEST.results.push(Object.create(Results).constructor('Game start creating players test', 'fail'));
		GAMESTARTTEST.testAddPlayersView = false;

	}

};

// 3.
;function testAddPlayersLogic() {

	if (GAME.players.length === 6 && GAME.playersF.length === 3 && GAME.playersM.length === 3) {

		TEST.results.push(Object.create(Results).constructor('GAME.players.length', 'success'));
		GAMESTARTTEST.testAddPlayersLogic = true;

	} else {

		TEST.results.push(Object.create(Results).constructor('GAME.players.length', 'fail'));
		GAMESTARTTEST.testAddPlayersLogic = false;

	}

	if ( GAMESTARTTEST.testAddPlayersLogic === true && GAMESTARTTEST.testAddPlayersView === true ) {

		triggerEvent('mousedown', document.querySelector('[data-newplayer-modal-button]'));

	}

};


