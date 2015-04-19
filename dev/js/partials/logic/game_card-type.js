/* =================================================

Парсит тип карточки

================================================== */


// 3.
;function cardType(text) {

	var symbol = text.slice(text.length - 1, text.length),
		cardText = text,
		content = { text: '', class: '' };

	if (symbol === '+' ||
		symbol === '#' ||
		symbol === ';') {
		cardText = cardText.slice(0, text.length - 1);
	}

	switch(symbol) {

		// Добавить игрока
		case '+': {

			var currentPlayerGender = GAME.currentPlayer.gender,
				random = 0;


			if ( currentPlayerGender === 'f' )
				currentPlayerGender = 'M';
			else if ( currentPlayerGender === 'm' )
				currentPlayerGender = 'F';

			random = getRandomInt(0, GAME['players' + currentPlayerGender].length - 1);
			GAME.targetPlayer = GAME['players' + currentPlayerGender][random];

			cardText += ' ' + GAME.targetPlayer.name;

			content.text = cardText;
			content.class = '';

		}
		break;

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

	console.log(content);
	// return parsed values
	return content;

}
