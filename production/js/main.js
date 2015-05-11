/* =========================================

functions.js - включает в себя различные вспомогательные функции


1. disableElements(); - Выключает все неактивные елементы
2. saveGameState(); - Сохранение текущего состояния игры
3. Проверка был ли загружен json в данной сессии, если да, то вернет первый аргумент, если нет, то второй

=========================================== */


// 1
;(function disableElements() {

	// disable all elements
	var disabledItems = document.querySelectorAll('[data-disabled]');

	bindListeners(disabledItems, 'mousedown', function(event) {

		event.preventDefault();

	});

})();




// 2
;function saveGameState() {

	if (localStorageTest()) {

		localStorage.setItem('info', JSON.stringify(GAME));

	} else {

		return;

	}

};



// 3
;function checkSessionJsonState(jsonTrue, jsonFalse) {

	if ( parseInt(sessionStorage.getItem('JSONINCURRENTSESSION')) === 2 ) {
		return jsonTrue;
	}

	else {
		return jsonFalse;
	}

};
/* ============================================

Всякий usefull стаф, вспомогательные функции которые
никак не относятся к приложению, а только упрощают написание кода

1. bindListeners(elements, listener, callback); - Функция которая обходит массив элементов и всем биндит
заданный эвент

2. Element.closest полифил

2.1. Element.remove полифил

3. Random функция

4. Поддерживает ли браузер localStorage

============================================ */


// 1.
function bindListeners(elements, listener, callback) {


	[].forEach.call(elements, function (element, index, array) {

		element.addEventListener(listener, function (event) {

			callback(event, element);

		});

	});
}


// 2.
(function (ELEMENT, PREFIX) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT[PREFIX + 'MatchesSelector'];

	ELEMENT.closest = ELEMENT.closest || function (selector) {
		var node = this;

		while (node) {
			if (node.matches(selector)) return node;
			else node = node.parentElement;
		}

		return null;
	};
})(
	Element.prototype,
	(this.getComputedStyle && [].join.call(getComputedStyle(document.documentElement, '')).match(/-(moz|ms|webkit)-/) || [])[1]
);

// 2.1.

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = 0, len = this.length; i < len; i++) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}


// 3.
function getRandomInt(min, max) {

	return Math.floor(Math.random()*(max + 1 - min)) + min;

}


// 4.
function localStorageTest() {

	var test = 'test';

	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}

}


/* ======================================

GAME - переменная которая хранит в себе текущее состояние игры
Например игроков, начата ли игра, вопросы и действия и т.д.

1. Массив который хранит объекты игроков

Пример объекта:
{
	name: 'bogdan',
	gender: 'f',
	truthStreak: 0,
	actionsStreak: 0
}

truthStreak/actionsStreak - количество выбранной правды.действий подряд

2. Объекты игроков женского, мужского пола

3. Текущий игрок

4. Игрок - цель

5. Массив для перечисления всех рубрик, например:
['16', '21']

6. Массивы содержат вопросы/действия, например:
['Когда завтра?', 'Спой песню', ...]

7. Хранит в себе json с вопросами

8. Отслеживает состояние загрузки json
	0 - не загружен
	1 - загружается
	2 - загружен

9. Отслеживает состояние игры
	0 - не начата, нет сохранений
	1 - начата

10. Отслеживает, была ли загрузка json в данной сессии
	0 - не было
	1 - загружается
	2 - загружен

====================================== */

var GAME = {
	// 1
	players: [],
	// 2
	playersM: [],
	playersF: [],
	// 3
	currentPlayer: {},
	// 4
	targetPlayer: {},
	// 5
	rubrics: [],
	// 6
	actions: [],
	truth: [],
	// 7
	json: {},
	// 8
	jsonState: 0,
	// 9
	gameState: 0
}

// 10.
sessionStorage.setItem('JSONINCURRENTSESSION', 0);
/* =================================================

Парсит тип карточки

# Символы

'+' - добавление игрока противоположного пола в конец предложения,
например: Миша поцелуй игрока+, вырожение после парсинга будет выглядеть так:
Миша поцелуй игрока Лена;

'#' - серая карточка, её нельзя читать вслух и надо выполнять
так чтобы игроки не знали что за задание внутри;

';' - коллективное действие, все игроки участвуют;

# Идеи
Символ для выбора игрока из обоих полов = '>';
Символ для вставки имени игрока в текст = '<Player>';



================================================== */


// 3.
;function cardType(text) {

	var symbol = text.slice(text.length - 1, text.length),
		cardText = text,
		content = { text: '', class: '' },
		possibleSymbols = ['+', '#', ';'],
		isSymbol = false;

	possibleSymbols.every(function (element, index, array) {

		if ( element === symbol ) {
			isSymbol = true;
			return false;
		}

		return true;

	});

	if ( isSymbol ) {
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

	// return parsed values
	return content;

}

/* ======================================

Здесь происходит инициализация игры

1. Инциализация игры, вызов рендера игрока, инициализация функции выдачи вопросов,
запись вопросов/действий в GAME.truth/GAME.actions

1. Сохранение данных в LocalStorage
1.1. Рендер игроков в облако игроков
1.2. Запись вопрос и действий в GAME.truth/GAME.actions по выбраным рубрикам
Если это рестарт предъидущей игры, не обновлять вопросы
1.3. Выбор игрока, который ходит
1.4. Обновляем модальные окна
1.5. Сообщаем о том что игра начата

======================================= */


// 1.
;function gameInit(type) {

	// 1.
	saveGameState();

	// 1.1. 
	updateMainPlayersCloud();

	// 1.2.
	if ( type !== 'restart' ) {

		updateAllTruthActions();

	}

	// 1.3.
	nextPlayer();

	// 1.4.
	updateModals();

	// 1.5.
	GAME.game = true;


};
/* =============================

Отвечает за показ модального окна и выдачей в него html вопроса/действия

1. Вешаем эвент листенеры на кнопки выбора правды или действия
2. Выбираем правду или действие, выбранный вопрос удаляем из массива, если
вопросы или действие кончились, обновляем
3. Определяем тип карточки
5. Добавление вопроса, действия в стрик
6. Проверка доступности вопросов/действий

============================= */

// 1.
;(function buttonEvents() {

	var showModalButton = document.querySelectorAll('[data-showmodal-button]');
		closePopupButton = document.querySelector('[data-game-modalclose-button]');


		bindListeners(showModalButton, 'mousedown' , function (event, element) {

			var type = element.getAttribute('data-showmodal-button');

			getTruthOrAction(type);

		});

		closePopupButton.addEventListener('mousedown', function(event) {

			closeModal();

		});




})();

// 2.
;function getTruthOrAction(type) {

	var text = '',
		min = 0,
		random = null;
		// get random question
		random = getRandomInt(min, GAME[type].length - 1);
		text = GAME[type][random];
		GAME[type].splice(random, 1);

		// save current progress in localStorage
		saveGameState();

		if ( type === 'truth' ) {

			addStreak(type);

			if ( GAME.truth.length === 0 )
				updateTruth();
		}

		if ( type === 'actions' ) {

			addStreak(type);

			if ( GAME.actions.length === 0 )
				updateAction();
		}

		// get card type
		var content = cardType(text); 

		// render modal
		showModal(content);

};

// 3.
// Replaced into game_card-type.js

// 5.
;function addStreak(type) {

	[].every.call(GAME.players, function (element, index, array) {

		if (element.isCurrentPlayer) {

			if ( type === 'truth' ) {
				element.truthStreak += 1;
				element.actionsStreak = 0;
			}

			else if ( type === 'actions' ) {
				element.actionsStreak += 1;
				element.truthStreak = 0;
			}

			return false;
		}

		return true;

	});

};

// 6.
;function getCheckedStreak() {

	var status = {},
		max = 2,
		truthCount = 0,
		actionsCount = 0;

	GAME.players.every(function (element, index, array) {

		if (element.isCurrentPlayer) {

			truthCount = element.truthStreak;
			actionsCount = element.actionsStreak;

			return false;
		}

		return true;

	});

	switch(max) {
		case truthCount: {
			status = {truth: false, actions: true};
		}
		break;

		case actionsCount: {
			status = {truth: true, actions: false};
		}
		break;

		default: {
			status = {truth: true, actions: true};
		};
		break;
	}

	return status;

};
/* ===================================

1. Выбор игрока, который выполняет ход

===================================== */


;function nextPlayer() {

	var isNoOneActive = true,
		playerName = '',
		playerOutput = document.querySelector('[data-picked-player]');

	GAME.players.every( function (element, index, array) {

		if (element.isCurrentPlayer === true) {
			// set isCurrentPlayer to false
			// set to next element isCurrentPlayer true
			GAME.players[index].isCurrentPlayer = false;
			isNoOneActive = false;

			if ( GAME.players[index + 1] ) {
				// set to next isCurrentPlayer Active
				GAME.players[index + 1].isCurrentPlayer = true;
				GAME.currentPlayer = GAME.players[index + 1];
				playerName = GAME.currentPlayer.name;
			}

			else {
				// set to first isCurrentPlayer Active
				GAME.players[0].isCurrentPlayer = true;
				GAME.currentPlayer = GAME.players[0];
				playerName = GAME.currentPlayer.name;
			}

			return false;

		}

		return true;

	});

	if (isNoOneActive) {
		// set isCurrentPlayer to true first player
		GAME.players[0].isCurrentPlayer = true;
		GAME.currentPlayer = GAME.players[0];
		playerName = GAME.players[0].name;
	}

	// write in html player name
	playerOutput.innerHTML = playerName + ' ';


};
/* =============================================

Этот файл отвечает за логику начала игры, например
эвенты связанные с добавлением игроков, загрузка json...

1. gameStartLogic(); - функция обрабатывающая начало игры.
1.1. Выбор половой принаджлености и запись в переменную выбраного пола
1.2. Нажатие на кнопку добавить, добавление игрока в облако игроков, вызов рендер функции playerAdd(...);
1.3 Инициализация игры

2. gameStartSavePlayers(); - сохранение игроков в переменную GAME.players

3. Проверка, был ли добавлен такой игрок

4. Закрываем game_start, качаем json, инициализируем игру

=============================================== */

// 1. 
;function gameStartLogic() {

	var gameStartPlayerInput = document.querySelector('[data-gamestart-playerInput]'),
		gameStartPlayerButtonAdd = document.querySelector('[data-gamestart-playerAdd]'),
		gameStartPlayerGenderSelect = document.querySelectorAll('[data-gamestart-genderRadio]'),
		gameStartPlayerGender = null,
		gameStartButton = document.querySelector('[data-gamestart-start]');

		// 1.1.
		bindListeners(gameStartPlayerGenderSelect, 'change', function(event, element) {

			if (element.checked)
				gameStartPlayerGender = element.value;

		});

		// 1.2.
		gameStartPlayerButtonAdd.addEventListener('mousedown', function(event) {

			if ( gameStartPlayerInput.value.length >= 2 && gameStartPlayerGender !== null ) {

				gameStartPlayerAdd(gameStartPlayerInput.value, gameStartPlayerGender, gameStartPlayerInput);
				gameStartPlayerInput.value = '';

			}

			SavePlayers(document.querySelectorAll('[data-gamestart-player]'), 'data-gameStart-player-gender');

		});

		// 1.3
		gameStartButton.addEventListener('mousedown', function(event) {

			if ( GAME.jsonState === 1 ) {

				preloader('show');

			}

			if ( GAME.jsonState === 2 ) {

				GAME.gameState = 1;
				gameInit();

			}


		});



};

;(function gameStartLogicCall() {

	gameStartLogic();

})();

// 2.
;function SavePlayers(players, playersGenderAttr) {

	var gameStartPlayers = players,
		playerName = '',
		playerGender = '';

	// player Proto
	var Player = {
		constructor: function (name, gender) {
			this.name = name;
			this.gender = gender;
			this.actionsStreak = 0;
			this.truthStreak = 0;
			this.isCurrentPlayer = false;
			return this;
		}
	}

	// reset GAME.player for rewrite
	GAME.players = [];
	GAME.playersF = [];
	GAME.playersM = [];

	// update GAME.players
	[].forEach.call(gameStartPlayers, function (element, index, array) {

		playerName = element.innerText || element.textContent;
		playerGender = element.getAttribute(playersGenderAttr);

		// create new player
		player = Object.create(Player).constructor(playerName, playerGender);
		// sort player
		GAME.players.push(player);
		GAME['players' + player.gender.toUpperCase()].push(player)

	});

};

// 3.
;function gameStartCheckPlayerExist(input) {

	var isExist = false;

	isExist = GAME.players.some( function (element, index, array) {

		if (element.name === input.value) {
			return true;
		}

	});

	return isExist;

};


// 4.
;function gameStartClose() {

	var gameStartWrap = document.querySelector('[data-gamestart]'),
		timeout = null,
		lastModal = document.querySelectorAll('[data-gamestart-modal]');


	gameStartWrap.classList.add('hidden');
	lastModal[lastModal.length - 1].classList.add('hidden');

	timeout = setTimeout(function() {

		gameStartWrap.classList.add('visibility');

	}, 600);

	// getJson();

};
/* ======================================

В этом файле происходит запись действий/вопросов в GAME.truth/GAME.actions

1. Добавление правды
2. Добавление действий
3. Добавление и действий и вопросов

PS Разделено на несколько функций для удобства обновлений вопрос или действий

======================================= */

// 1.
;function updateTruth() {

	GAME.truth = [];

	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			if (item === element) {

				for (var truth in GAME.json[item].true) {
					GAME.truth.push(GAME.json[item].true[truth]);
				}

			}

		}

	});

};

// 2.
;function updateAction() {

	GAME.actions = [];


	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			if (item === element) {

				for (var actions in GAME.json[item].action) {
					GAME.actions.push(GAME.json[item].action[actions]);
				}

			}

		}

	});
};


;function updateAllTruthActions() {

	updateTruth();
	updateAction();

};
/* ======================================

Получение json'а с вопросами

====================================== */


;function getJson() {

	var jsonPath = 'assets/response.json';

	// если офлайн режим
	if ( !navigator.onLine ) {
		GAME.json = JSON.parse(localStorage.getItem('json'));
		gameInit();
		return;
	}

	var request = new XMLHttpRequest();
	request.open('GET', jsonPath, true);

	GAME.jsonState = 1;
	sessionStorage.setItem('JSONINCURRENTSESSION', 1);

	request.onload = function() {

		if (request.status >= 200 && request.status < 400) {

			var data = JSON.parse(request.responseText);
			GAME.json = data;
			GAME.jsonState = 2;

			if (localStorageTest())
				localStorage.setItem('json', JSON.stringify(data));

			// set json state to 2, it'means json is loaded
			sessionStorage.setItem('JSONINCURRENTSESSION', 2);

			// if json was loaded after game-start, hide preloader,
			// init game
			if ( preloader('getState') === 'visible' && GAME.jsonState === 2 ) {

				preloader('hide');
				gameInit();

			}

			GAME.jsonState = 2;
			GAME.gameState = 1;
		}
	};

	request.onerror = function() {
		// throw error
	};

	request.send();


};

/* ==================================

Этот файл содержит рендет шаблоны

1. Шаблон для создания игрока в начале игры
2. Шаблон для создания игрока в игре
3. Шаблон модального окна с созданием/удалением игроков

==================================== */

var TEMPLATES = {

	// 1.
	gameStartCreatePlayer: function (gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			template = '<span class="game-start_player game-start_player--' + genderClass + 'male' + '" data-gameStart-player-gender="' + gender + '" data-gamestart-player>';
			template +=  name + '<span class="game-start_player-remove" data-gamestart-player-remove><\/span><\/span>';
			return template;
	},

	// 2.
	player: function (gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			avatar = gender === 'm' ? 'business' : 'woman',
			template = '<div class="player_item player_item--' + genderClass + 'male" data-game-player><div class="player_item_avatar player_item_avatar--' + genderClass + 'male"><svg width="22px" height="22px"><use xlink:href="#' + avatar + '"><\/use><\/svg><\/div><div class="player_item_name">' + name + '<\/div><\/div>';
			return template;
	}


}

/* =====================================

Показ модального окна
1. Открытие модального окна, данные content @ type берутся из функции getTruthOrAction(type);
2. Закрытие модального окна, проверка стриков

====================================== */

// 1.
;function showModal(content) {

	var overlay = document.querySelector('[data-game-overlay]'),
		modal = document.querySelector('[data-game-modal]');

	var modalText = modal.querySelector('[data-game-modal-content]');
	modalText.innerHTML = content.text;

	overlay.classList.remove('hidden');
	overlay.classList.add('active');

	if (content.class.length >= 1) {
		modal.classList.add(content.class);
	}

	var timeout = setTimeout(function () {

		modal.classList.remove('hidden');
		modal.classList.add('active');

	}, 600);


};

// 2.
;function closeModal() {

	var overlay = document.querySelector('[data-game-overlay]'),
		modal = document.querySelector('[data-game-modal]'),
		truthButton = document.querySelector('[data-showmodal-button="truth"]'),
		actionsButton = document.querySelector('[data-showmodal-button="actions"]');

	modal.classList.remove('active');
	overlay.classList.remove('active');

	// next player
	nextPlayer();
	var status = getCheckedStreak();

	// disable/enable buttons
	if (status.truth === false) {
		truthButton.classList.add('disabled');
		truthButton.setAttribute('data-disabled', 'true');
	} else {
		truthButton.classList.remove('disabled');
		truthButton.removeAttribute('data-disabled');
	}


	// disable/enable buttons
	if (status.actions === false) {
		actionsButton.classList.add('disabled');
		actionsButton.setAttribute('data-disabled', 'true');
	} else {
		actionsButton.classList.remove('disabled');
		actionsButton.removeAttribute('data-disabled');
	}

	var timeOut = setTimeout(function () {

		modal.classList.add('hidden');
		modal.classList.remove('gray', 'mass');
		overlay.classList.add('hidden');


	}, 600);


};
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
/* ========================================

Файл отвечает за рендер и работу модальных окон при начале игры
Логика начала игры расположена в ../logic/game_start.js
Рендер шаблоны TEMPLATES расположен в TEMPLATES.js

1. gameStartView(); - функция которая отвечает за переключение (вперед/назад) модальных окон
1.1. Кнопка "Далее", если нет больше модальных окон, то закрыть "Начало игры"
1.2. Кнопка "Назад", пролистывает окна назад
1.3. Клик по кнопке начало игры, инициализация игры

2. playerAdd(); - Добавление игрока в облако игроков, отвечает только за рендер html

3. Удаление игрока

4. Выбор рубрики

========================================== */


// 1.
;function gameStartView() {


	var gameStartModals = document.querySelectorAll('[data-gamestart-modal]'),
		gameStartNextButtons = document.querySelectorAll('[data-gamestart-nextmodal]'),
		gameStartWrap = document.querySelectorAll('[data-gamestart]'),
		gameStartBackButtons = document.querySelectorAll('[data-gamestart-prevmodal]'),
		gameStartStartGame = document.querySelector('[data-gamestart-start]'),
		gameStartNextModal = null,
		gameStartPrevModal = null,
		currentModal = null;

	// Next button
	// 1.1.
	bindListeners(gameStartNextButtons, 'mousedown', function (event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartNextModal = currentModal.nextSibling;

		// hide current modal
		currentModal.classList.add('hidden');
		// show next modal
		gameStartNextModal.classList.add('active');

	});

	// Prev button
	// 1.2.
	bindListeners(gameStartBackButtons, 'mousedown', function (event, element) {

		currentModal = element.closest('[data-gamestart-modal]');
		gameStartPrevModal = currentModal.previousSibling;

		// hide current modal
		currentModal.classList.remove('active');
		// show next modal
		gameStartPrevModal.classList.remove('hidden');

	});

	// 1.3.
	gameStartStartGame.addEventListener('mousedown', function(event) {

		gameStartClose();

	});


};

// call game start view
;(function callGameStart() {

	gameStartView();

})();


// 2.
;function gameStartPlayerAdd(name, gender, input) {

	var gameStartPlayersContainer = document.querySelector('[data-gamestart-playerContainer]');

	if (gameStartCheckPlayerExist(input)) {
		// player exist
		// throw error here
		return;
	}

	gameStartPlayersContainer.insertAdjacentHTML('beforeend', TEMPLATES.gameStartCreatePlayer(gender, name));

	// update delete binds
	gameStartPlayerDeleteBind();

	if ( document.querySelectorAll('[data-gamestart-player]').length >= 2 ) {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');

	} else {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');

	}


};


// 3.
;function gameStartPlayerDelete(sender) {

	var gameStartPlayersContainer = document.querySelector('[data-gamestart-playerContainer]'),
		playerName = sender.innerText || sender.textContent,
		playerGender = sender.getAttribute('data-gamestart-player-gender');

	GAME.players = GAME.players.filter(function (element, index, array) {

		return element.name !== playerName;

	});

	GAME['players' + playerGender.toUpperCase()] = GAME['players' + playerGender.toUpperCase()].filter(function (element, index, array) {

		return element.name !== playerName;

	});

	sender.remove();

	if ( document.querySelectorAll('[data-gamestart-player]').length >= 2 ) {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');

	} else {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');

	}

};



;function gameStartPlayerDeleteBind() {

	var gameStartPlayerButtonDelete = document.querySelectorAll('[data-gamestart-player]');
	// 3.
	bindListeners(gameStartPlayerButtonDelete, 'click', function (event, element) {

		gameStartPlayerDelete(element.closest('[data-gamestart-player]'));

	});
};


// 4.
;function gameStartRubricSelect() {

	var checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	bindListeners(checkboxes, 'change', function (event, element) {
		// reset Rubrics
		GAME.rubrics = [];

		if (isChecked(checkboxes))
			element.closest('[data-gamestart-modal]').querySelector('[data-rubricselect-modal-button]').removeAttribute('data-disabled');
		else
			element.closest('[data-gamestart-modal]').querySelector('[data-rubricselect-modal-button]').setAttribute('data-disabled', '');

		// update picked rubrics
		[].forEach.call(checkboxes, function (element, index, array) {

			if (element.checked)
				GAME.rubrics.push(element.value);

		});

	});

	function isChecked(elements) {

		var isCheckboxCheked = false;

		[].some.call(elements, function (element, index, array) {

			if (element.checked) {
				isCheckboxCheked = true;
				return false;
			}

		});

		if (isCheckboxCheked)
			return true;
		else
			return false;

	};

};


;(function gameStartRubricSelectCall() {

	gameStartRubricSelect();

})();
/* ===========================================

Файл который проверяет, была ли начата игра

1. Игра уже уже была начата и выбрали кнопку продолжить
2. Кнопка начать игру заново, если игра уже была начата, обновить модальные окна 

============================================ */


;(function gameStarted() {

	if ( localStorage.getItem('info') ) {

		var currentGame = JSON.parse(localStorage.getItem('info')),
			gameStartWrap = document.querySelector('[data-gamestart]'),
			gameStartedWrap = document.querySelector('[data-game-restart-wrap]'),
			continueButton = document.querySelector('[data-game-continue]');

		gameStartWrap.classList.add('visibility');
		gameStartedWrap.classList.add('active');

		continueButton.addEventListener('mousedown', function (event) {

			GAME = currentGame;
			gameInit('restart');
			gameStartedWrap.classList.remove('active');

		});


	}

})();


;(function restartGame() {

	var restartButtons = document.querySelectorAll('[data-game-restart]'),
		gameStartWrap = document.querySelector('[data-gamestart]'),
		gameStartModals = document.querySelectorAll('[data-gamestart-modal]'),
		gameRestartWrap = document.querySelector('[data-game-restart-wrap]');

	bindListeners(restartButtons, 'mousedown', function (event, element) {

		localStorage.removeItem('info');
		var attr = element.getAttribute('data-game-restart');

		if ( attr = 'resetModals' )
			resetModals();

		resetGAME();
		gameStartWrap.classList.remove('visibility', 'hidden');
		gameRestartWrap.classList.remove('active');


		[].forEach.call(gameStartModals, function (element, index, array) {

			element.classList.remove('active', 'hidden');

			if ( index === 0 ) {
				element.classList.add('active');
			}

		});

		// upload json
		if ( parseInt(sessionStorage.getItem('JSONINCURRENTSESSION')) === 0 && navigator.onLine )
			getJson();

	});



})();



;function resetModals() {

	var gameStartHtml = localStorage.getItem('gamestartHTML');

	document.querySelector('[data-gamestart]').innerHTML = gameStartHtml;

	gameStartView();
	gameStartLogic();
	gameStartRubricSelect();

};

;function resetGAME() {

	GAME = {
		players: [],
		playersM: [],
		playersF: [],
		currentPlayer: {},
		targetPlayer: {},
		rubrics: [],
		actions: [],
		truth: [],
		json: checkSessionJsonState(JSON.parse(localStorage.getItem('json')), {}),
		jsonState: checkSessionJsonState(2, 0),
		gameState: 0
	}


};
/* ===================================

Обновление модальных окон после того, как игра была начата


===================================== */

;function updateModals() {

	var playersModal = document.querySelector('[data-newPlayer-modal]'),
		rubricModal = document.querySelector('[data-rubricSelect-modal]'),
		rulesModal = document.querySelector('[data-rules-modal]');


	// remove back button
	[].forEach.call(document.querySelectorAll('[data-gamestart-modal]'), function (element, index, array) {

		if ( element.querySelector('[data-gamestart-prevmodal]') ) {

			element.querySelector('[data-gamestart-prevmodal]').remove();

			if ( element.querySelector('[data-gamestart-nextmodal]') ) {
				element.querySelector('[data-gamestart-nextmodal]').classList.remove('next-back');
			}

		}

		if ( element.querySelector('[data-gamestart-nextmodal]') ) {
			element.querySelector('[data-gamestart-nextmodal]').innerHTML = 'Ок';
		}

	});

	// remove attr which trigger nextButton
	[].forEach.call(document.querySelectorAll('[data-gamestart-nextmodal]'), function (element, index, array) {

		element.removeAttribute('data-gamestart-nextmodal');
		element.setAttribute('data-close-default-modal', '');

	});

	bindListeners(document.querySelectorAll('[data-close-default-modal]'), 'mousedown', function (event, element) {

		if ( element.getAttribute('data-newplayer-modal-button') !== null &&
			 element.getAttribute('data-newplayer-modal-button') !== undefined) {
			updateMainPlayersCloud();
			saveGameState();
		}

		if ( element.getAttribute('data-rubricselect-modal-button') !== null &&
			 element.getAttribute('data-rubricselect-modal-button') !== undefined) {
			updateAllTruthActions();
			saveGameState();
		}

		// close modals
		element.closest('[data-gamestart-modal]').classList.add('hidden');

		var gameStartWrap = document.querySelector('[data-gamestart]'),
			timeout = null;

		gameStartWrap.classList.add('hidden');

		timeout = setTimeout(function() {

			gameStartWrap.classList.add('visibility');

		}, 600);

	});

	bindListeners(document.querySelectorAll('[data-show-default-modal]'), 'click', function (event, element) {

		event.preventDefault();

		// open modals
		var targetModalName = element.getAttribute('data-show-default-modal'),
			targetModal = document.querySelector('[' + targetModalName + ']'),
			gameStartWrap = document.querySelector('[data-gamestart]'),
			timeout = null;

		gameStartWrap.classList.remove('visibility');
		gameStartWrap.classList.remove('hidden');

		timeout = setTimeout(function() {

			targetModal.classList.remove('hidden');
			targetModal.classList.add('active');

		}, 100);

	});

};
window.onload = function(event) {

	preloader('hide');

	// save default game start for reset to default state
	var saveDefaultGameStart;

	saveDefaultGameStart = document.querySelector('[data-gamestart]').innerHTML;

	localStorage.setItem('gamestartHTML', saveDefaultGameStart);

	// preload json if game was not started
	if ( !localStorage.getItem('info') && navigator.onLine )
		getJson();

};


;function preloader(method) {


	var preloaderConfigs = {
		selector: document.querySelector('.preloader'),
		visiblityClass: 'visibility',
		opacityClass: 'opacity',
		transitionTime: 600
	}

	switch(method) {
		case 'hide': {

			preloaderConfigs.selector.classList.add(preloaderConfigs.opacityClass);

			var timeout = setTimeout(function() {

				preloaderConfigs.selector.classList.add(preloaderConfigs.visiblityClass);

			}, preloaderConfigs.transitionTime);

		};
		break;

		case 'show': {

			preloaderConfigs.selector.classList.remove(preloaderConfigs.visiblityClass);
			preloaderConfigs.selector.classList.remove(preloaderConfigs.opacityClass);

		}
		break;

		case 'getState': {

			if ( preloaderConfigs.selector.classList.contains(preloaderConfigs.visiblityClass) ) {
				return 'hidden';
			}

			else {
				return 'visible';
			}

		}
		break;
	}

};
/* ==============================

Показ/скрытие сайдбара

================================ */
;(function sidebar() {

	var toggleButton = document.querySelector('[data-sidebar-toggle]'),
		sidebar = document.querySelector('.sidebar'),
		header = document.querySelector('.header'),
		links = document.querySelectorAll('.sidebar_link');

	// because android 4.3 and lower not support
	// classList.toggle

	toggleButton.addEventListener('mousedown', function (event) {

		if ( toggleButton.classList.contains('active') ) {

			toggleButton.classList.remove('active');
			sidebar.classList.remove('active');
			header.classList.remove('active');

		} else {

			toggleButton.classList.add('active');
			sidebar.classList.add('active');
			header.classList.add('active');

		}

	});

	bindListeners(links, 'click', function (event, element) {

		if ( toggleButton.classList.contains('active') ) {

			toggleButton.classList.remove('active');
			sidebar.classList.remove('active');
			header.classList.remove('active');

		} else {

			toggleButton.classList.add('active');
			sidebar.classList.add('active');
			header.classList.add('active');

		}

	});


})();
/* ==================================

Тест начала игры, выбор рубрики

1. 

=================================== */

// 1.
;function testRubricSelect() {

	var pick = getRandomInt(0, 2),
		checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	[].forEach.call(checkboxes, function (element, index, array) {

		element.checked = false;

	});

	[].forEach.call(checkboxes, function (element, index, array) {

		if (pick >= index) {

			element.checked = true;
			triggerEvent('change', element);

		}

	});

	if ( GAME.rubrics.length === pick + 1 ) {

		TEST.results.push(Object.create(Results).constructor('GAME.rubrics.length', 'success'));
		triggerEvent('mousedown', document.querySelector('[data-rubricselect-modal-button]'));

	} else {

		TEST.results.push(Object.create(Results).constructor('GAME.rubrics.length', 'fail'));


	}


};
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



/* ==========================================

1. element.trigger

============================================ */

// 1
;function triggerEvent(eventName, target) {

	target.addEventListener('eventName', function (event) {

		console.log('trigger');

	});

	// Create the event
	var triggerEvent = new CustomEvent(eventName, { "detail": "Example of an event" });

	// Dispatch/Trigger/Fire the event
	target.dispatchEvent(triggerEvent);


};
/* ============================

Запуск теста

1. Переменная которая хранит результаты теста
2. Создание результата теста
3.

============================== */

// 1.
var TEST = {
	results: [],
	succes: 0,
	errored: 0
};

// 2.
var Results = {

	constructor: function(testName, testStatus) {
		this.name = testName;
		this.status = testStatus;
		return this;
	}

}


// Запуск теста
;function runTests() {

	TEST = {
		results: [],
		succes: 0,
		errored: 0
	};

	console.log('===================== STARTING TESTS =====================');

	testAddPlayersView();
	testAddPlayersLogic();
	testRubricSelect();

	TEST.results.forEach( function (element, index, array) {

		console.log('TEST: " ' + element.name.toUpperCase() + ' " , TEST STATUS: <<<< ' + element.status.toUpperCase() + ' >>>>');

	});

	console.log('===================== ENDING TESTS =====================');


};
