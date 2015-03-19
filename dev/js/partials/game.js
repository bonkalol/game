// TODO
// 1. СДЕЛАТЬ ПРОВЕРКУ НА ТО, БЫЛ ЛИ ЗАДАН ВОПРОС


function game(data) {

	console.log(data);

	$.each(data, function(i, v) {

		// find rubrics rubrics
		ENV.rubrics.some(function(element, index, arrya) {

				if (i === element) {
					addQA(i, v);
				}

		});



	});

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

	saveDataStorage();
	next();

}


function next() {

	var $currentPlayer = $('.player_item.active'),
		$players = $('.player_item');
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

	});

	$('[data-action]').on('mousedown', function() {

		getQuestionOrAction(ENV.playerCurrentGender, 'a');

	});

});


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

		if (!random()) {
			random();
		} else {
			text = ENV.q[value];
			// add to ENV.answered
			parseQorAValue(text);

			if (playerQorA(text)) {

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

			} else {

				writeText(text);

			}
			// if end

		}

	}

	if (type === 'a') {

		max = ENV.a.length - 1;

		if (!random()) {
			random();
		} else {
			text = ENV.a[value];
			// add to ENV.answered
			parseQorAValue(text);

			if (playerQorA(text)) {

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

			} else {

				writeText(text);

			}
			// if end

		}

	}


	function writeText(text) {

		var getText = text.split(':');

		$textHolder.text(getText[1]);

		if (playerQorA(text)) {
			$textHolder.text(getText[1].slice(0, getText[1].length - 1));
		}
	}


	// get random Q or A
	function random() {
		value = getRandomInt(min, max);
		var status = true;

		ENV.answered.some(function(element, index, array) {

			if (parseInt(element) === parseInt(value)) {
				return false;
				status = false;
				console.log('fail: ' + element + ' ' + value);
			}

		});

		if (status === false) {
			return false;
		} else {
			return true;
		}
	}


	// determines whether it is necessary to connect the player
	function playerQorA(value) {

		var lastSymbol = '';

		lastSymbol = value.split('');
		lastSymbol = lastSymbol[lastSymbol.length - 1];

		console.log(lastSymbol);

		if (lastSymbol === '+') {
			return true;
		} else {
			return false;
		}

	}


	// get random player
	function randomPlayer(gender) {

		if (gender === 'm') {
			var minPlayers = 0,
				maxPlayers = ENV.playersF.length - 1;

			var getRandomPlayer = getRandomInt(minPlayers, maxPlayers);
				console.log(getRandomPlayer);

			ENV.playerTarget = ENV.playersF[getRandomPlayer];

		}

		if (gender === 'f') {
			var minPlayers = 0,
				maxPlayers = ENV.playersM.length - 1;

			var getRandomPlayer = getRandomInt(minPlayers, maxPlayers);
				console.log(getRandomPlayer);

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