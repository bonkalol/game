// TODO
// 1. СДЕЛАТЬ ПРОВЕРКУ НА ТО, БЫЛ ЛИ ЗАДАН ВОПРОС
// 2. РЕФАКТОР КОДА


function game(data) {

	$.each(data, function(i, v) {

		// find rubrics rubrics
		ENV.rubrics.some(function(element, index, arrya) {

				if (i === element) {
					addQA(i, v);
				}

		});



	});


	next();
	saveDataStorage();

}


function next() {

	var $currentPlayer = $('.player_item.active');

	if ($currentPlayer.length === 0) {
		$currentPlayer = $('.player_item').eq(0);
	}

	var $players = $('.player_item');
		currentPlayerName = $currentPlayer.find('.player_item_name').text(),
		$pickedPlayer = $('.pick_player_name'),
		$nextPlayer = null,
		currentPlayerGender = '';

		// find genderType
		if ( $currentPlayer.hasClass('player_item--male') ) {
			currentPlayerGender = 'm';
		}

		if ( $currentPlayer.hasClass('player_item--female') ) {
			currentPlayerGender = 'f';
		}

		// update globs
		ENV.currentPlayer = currentPlayerName;
		ENV.currentPlayerGender = currentPlayerGender;


	// show current player
	$pickedPlayer.text(currentPlayerName + ' ');

	// find next player
	$nextPlayer = $currentPlayer.next();

	if ( $currentPlayer.next().length === 1 && $currentPlayer.next().hasClass('player_item--new') ) {

		$nextPlayer = $('.player_item').eq(0);

	}

	$currentPlayer.removeClass('active');
	$nextPlayer.addClass('active');

}


$(function() {

	$('[data-true]').on('mousedown', function() {

		getQuestionOrAction(ENV.playerCurrentGender, 'q');
		addStreak('q');

	});

	$('[data-action]').on('mousedown', function() {

		getQuestionOrAction(ENV.playerCurrentGender, 'a');
		addStreak('a');

	});

});

// 2.
// getQuestion
function getQuestionOrAction(gender, type) {


	var min = 0, max = 0,
		$textHolder = $('.modal_desc'),
		value = null,
		text = '';

	// parse var
	var number = null;

	if (type === 'q') {

		max = ENV.q.length - 1;

		value = getRandomInt(min, max);

		if (ENV.q.length === 0) {
			updateQandAENV();
		}

		text = ENV.q[value];
		ENV.q.splice(value, 1);
		// add to ENV.answered
		parseQorAValue(text);

		if (playerQorA(text) === '+') {

			console.log(ENV.currentPlayerGender);

			switch(ENV.currentPlayerGender) {
				case 'm': {
					randomPlayer('m');
					writeText(text.slice(0, text.length - 1) + ' ' + ENV.playerTarget);

				}
				break;

				case 'f': {
					randomPlayer('f');
					writeText(text.slice(0, text.length - 1) + ' ' + ENV.playerTarget);

				}
				break;
			}
			// switch end
			return;

		} 

		if (playerQorA(text) === '#') {
			$('[data-game-modal]').addClass('gray');
			writeText(text.slice(0, text.length - 1) + ' (Не читай в слух и выполняй)');
			return;
		}

		else {

			writeText(text);
			return;

		}
		// if end

	}

	if (type === 'a') {

		max = ENV.a.length - 1;
		value = getRandomInt(min, max);
		// #bug
		if (ENV.a.length === 0) {
			updateQandAENV();
		}

		text = ENV.a[value];
		ENV.a.splice(value, 1);
		// add to ENV.answered
		parseQorAValue(text);

		if (playerQorA(text) === '+') {

			console.log(ENV.currentPlayerGender);

			switch(ENV.currentPlayerGender) {
				case 'm': {
					randomPlayer('m');
					writeText(text.slice(0, text.length - 1) + ' ' + ENV.playerTarget);

				}
				break;

				case 'f': {
					randomPlayer('f');
					writeText(text.slice(0, text.length - 1) + ' ' + ENV.playerTarget);

				}
				break;
			}
			// switch end
			return;

		}

		if (playerQorA(text) === '#') {
			$('[data-game-modal]').addClass('gray');
			writeText(text.slice(0, text.length - 1) + ' (Не читайте вслух и помните что вы не должны выдавать содержимое карточки)');
			return;
		}

		else {

			writeText(text);
			return;

		}
		// if end

	}


	function writeText(text) {

		var getText = text.split(':');

		$textHolder.text(getText[1]);

		if (playerQorA(text)) {
			$textHolder.text(getText[1].slice(0, getText[1].length - 1));
		}
	}


	// determines whether it is necessary to connect the player
	function playerQorA(value) {

		var lastSymbol = '';

		lastSymbol = value.split('');
		lastSymbol = lastSymbol[lastSymbol.length - 1];

		console.log(lastSymbol);

		if (lastSymbol === '+') {
			return '+';
		}

		if (lastSymbol === '#') {
			return '#';
		}

		else {
			return false;
		}

	}


	// get random player
	function randomPlayer(gender) {

		if (gender === 'm') {
			var minPlayers = 0,
				maxPlayers = ENV.playersF.length - 1;

			var getRandomPlayer = getRandomInt(minPlayers, maxPlayers);
				// console.log(getRandomPlayer);

			ENV.playerTarget = ENV.playersF[getRandomPlayer];

		}

		if (gender === 'f') {

			var minPlayers = 0,
				maxPlayers = ENV.playersM.length - 1;

			var getRandomPlayer = getRandomInt(minPlayers, maxPlayers);
				// console.log(getRandomPlayer);

			ENV.playerTarget = ENV.playersM[getRandomPlayer];


		}


		return ENV.playerTarget;

	}

	// parse QorA value
	function parseQorAValue(text) {

		var value = text.split(':');
		value = parseInt(value[0]);

		ENV.answered.push(value);

	}


}



function addQA(i, v, rubric) {

	$.each(v, function(i, v) {

		if (i === 'true') {
			$.each(v, function(i, v) {
				// push to global bar question
				ENV.q.push(i + ':' + v);
			});
		}

		if (i === 'action') {
			$.each(v, function(i, v) {
				// push to global var action
				ENV.a.push(i + ':' + v);
			});
		}

	});

}


$(function () {

	// delete player
	$('body').on('mousedown', '.player_item_delete', function() {

		var $parrent = $(this).closest('.player_item'),
			$prev;

		if ( $parrent.hasClass('active') ) {
			
			if ( !$parrent.next().hasClass('.player_item--new') ) {
				$('.player_item').eq(0).addClass('active');
			} else {
				$('.player_item').next().addClass('active');
			}

		}

		// $parrent

		$parrent.remove();
		next();
		updatePlayers('game');

	});

});



function checkAvailable() {

	var player = ENV.currentPlayer,
		qCount = 0,
		aCount = 0,
		maxCount = 2;



	ENV.playersObjects.some(function (element, index, array) {

		if (player === element.name) {

			qCount = element.truthStreak;
			aCount = element.actionStreak;

			return false;

		}

	});

	if (qCount === maxCount) {
		return 'qFalse';
	}

	if (aCount === maxCount) {
		return 'aFalse';
	}

}


function addStreak(type) {

	var player = ENV.currentPlayer;


	ENV.playersObjects.some(function (element, index, array) {

		if (player === element.name) {

			if (type === 'q') {
				element.truthStreak += 1;
				element.actionStreak = 0;
			}


			if (type === 'a') {
				element.actionStreak += 1;
				element.truthStreak = 0;
			}

			return false;

		}

	});


}