/* =================================================

Парсит тип карточки

# Символы

{n} - вставить имя игрока

'#' - серая карточка, её нельзя читать вслух и надо выполнять
так чтобы игроки не знали что за задание внутри;

';' - коллективное действие, все игроки участвуют;


================================================== */
// 3.
;function cardType(text) {

	var symbol = text.slice(text.length - 1, text.length),
		cardText = text,
		content = { text: '', class: '' },
		possibleSymbols = ['#', ';'],
		isSymbol = false,
		isReplaceable = cardText.indexOf('{n}'),
		isPickPlayer = cardText.indexOf('{g}');

	isSymbol = possibleSymbols.some(function (element, index, array) {
		return element === symbol;
	});

	if ( isSymbol ) {
		cardText = cardText.slice(0, text.length - 1);
	}

	if ( isPickPlayer !== -1 ) {
		GAME.pickPlayer = true;
		cardText = cardText.split('{g}').join('');
	}

	if ( isReplaceable !== -1 ) {

		var currentPlayerGender = GAME.currentPlayer.gender,
			random = 0;

		if ( currentPlayerGender === 'f' )
			currentPlayerGender = 'M';
		else if ( currentPlayerGender === 'm' )
			currentPlayerGender = 'F';

		random = getRandomInt(0, GAME['players' + currentPlayerGender].length - 1);
		GAME.targetPlayer = GAME['players' + currentPlayerGender][random];
		cardText = cardText.split('{n}').join(GAME.targetPlayer.name);
	}

	switch(symbol) {

		// Серая карточка
		case '#': {

			content.text = cardText + ' (Не читайте вслух и помните что вы не должны выдавать содержимое карточки)';
			content.class = 'gray';

		}
		break;

		// Коллективное действие
		case ';': {

			content.text = cardText + ' (Коллективное действие)';
			content.class = 'mass';

		}
		break;

		// Простая карточка
		default: {

			content.text = cardText;
			content.class = '';

		}
		break;
	}

	// return parsed values
	return content;

}
