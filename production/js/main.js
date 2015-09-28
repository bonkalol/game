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


;function debugTools(age, type, name) {

	var json = GAME.json,
		parse = cardType(json[age][type][name]);

	showModal(parse);

}
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


Number.prototype.toArrayLength = function() {
	return this.valueOf() + 1;
};
/* ======================================

GAME - переменная которая хранит в себе текущее состояние игры
Например игроков, начата ли игра, вопросы и действия и т.д.

1. Массив который хранит объекты игроков

Пример объекта:
{
	name: 'bogdan',
	gender: 'f',
	truthStreak: 0,
	actionsStreak: 0,
	score: 0
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

11. Все вопросы / действия

12. Рубрики которые были выбраны

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
	// 12
	wasPicked: [],
	// 6
	actions: [],
	truth: [],
	// 7
	json: {},
	// 8
	jsonState: 0,
	// 9
	gameState: 0,
	// 11
	content: {
		truth: {
			'16': [],
			'18': [],
			'21': []
		},
		actions: {
			'16': [],
			'18': [],
			'21': []
		}
	}
}

// 10.
sessionStorage.setItem('JSONINCURRENTSESSION', 0);
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
		isReplaceable = cardText.indexOf('{n}');

	isSymbol = possibleSymbols.some(function (element, index, array) {
		return element === symbol;
	});

	if ( isSymbol ) {
		cardText = cardText.slice(0, text.length - 1);
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
	UpdateModals.updateHTML(UpdateModals.bind);

	// 1.5.
	GAME.game = true;


};
/* ==============================================

Лист выбора вопросов/действий

1. Check, deselect всех элементов
2. Хранение состояния game-list
	0 - не инициализировано
	1 - грузится
	2 - инициализировано
	3 - надо обновить


============================================== */

// 2.
;(function () {

	gameListStateSet(0);

})();

;function gameListStateSet(value) {

	sessionStorage.setItem('GAMELISTSTATE', value);

};

;function gameListStateGet() {

	return parseInt(sessionStorage.getItem('GAMELISTSTATE'));

};

// 1.
;function selectDeselect() {

	var target = null,
		targetAttr = null,
		listItems = null,
		selectDeselectButton = document.querySelectorAll('[data-select-action]'),
		checkClass = 'js-checked';

	bindListeners(selectDeselectButton, 'mousedown', function (event, element) {

		target = element;
		listItems = target.closest('[data-game-list-wrap]').querySelectorAll('[data-game-list-item]');
		targetAttr = target.getAttribute('data-select-action');


		if ( targetAttr === 'select' ) {

			[].forEach.call(listItems, function (element, index, array) {

				element.classList.add(checkClass);
				target.setAttribute('data-select-action', 'deselect');


			});

			return;

		}

		if ( targetAttr === 'deselect' ) {

			[].forEach.call(listItems, function (element, index, array) {

				element.classList.remove(checkClass);
				target.setAttribute('data-select-action', 'select');


			});

			return;

		}

	});

};


;function gameListSaveChecked() {

	var truthContainers = document.querySelectorAll('[data-game-list-wrap$="0"]'),
		actionContainers = document.querySelectorAll('[data-game-list-wrap$="1"]');
	GAME.truth = [];
	GAME.actions = [];

	[].forEach.call(truthContainers, function (element, index, array) {

		var items = element.querySelectorAll('[data-game-list-item].js-checked');

		[].forEach.call(items, function (element, index, array) {

			var text = element.innerText || element.textContent;

			GAME.truth.push(text);

		});

	});

	[].forEach.call(actionContainers, function (element, index, array) {

		var items = element.querySelectorAll('[data-game-list-item].js-checked');

		[].forEach.call(items, function (element, index, array) {

			var text = element.innerText || element.textContent;

			GAME.actions.push(text);

		});

	});

	if ( GAME.truth.length === 0 ) {
		updateTruth();
	}

	if ( GAME.actions.length === 0 ) {
		updateAction();
	}

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

var TYPE = '';

// 1.
;(function buttonEvents() {

	var showModalButton = document.querySelectorAll('[data-showmodal-button]');
		closePopupButton = document.querySelector('[data-game-modalclose-button]'),
		nextQA = document.querySelector('[data-game-modal-next]');


		bindListeners(showModalButton, 'mousedown' , function (event, element) {

			var type = element.getAttribute('data-showmodal-button');

			TYPE = type;
			getTruthOrAction(type);

		});

		closePopupButton.addEventListener('mousedown', function(event) {

			closeModal();

		});

		// reupdate content
		nextQA.addEventListener('mousedown', function (event) {

			var content = getTruthOrAction(TYPE, true),
				modal = document.querySelector('[data-game-modal]');

			var modalText = modal.querySelector('[data-game-modal-content]');
			modalText.innerHTML = content.text;

			modal.classList.remove('gray');
			modal.classList.remove('mass');

			if (content.class.length >= 1) {
				modal.classList.add(content.class);
			}

			nextQA.setAttribute('data-disabled', null);

		});



})();

// 2.
;function getTruthOrAction(type, isReinit) {

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
		if ( !isReinit || isReinit === 'undefined' || isReinit === null ) {

			showModal(content);

		} else {

			return content;

		}

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
			this.score = 0;
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
4. Сохранение всех вопросов и действий в переменную GAME.content

PS Разделено на несколько функций для удобства обновлений вопрос или действий

======================================= */

// 1.
;function updateTruth() {

	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			var wasPicked = null;
			if (GAME.wasPicked) {
				wasPicked = GAME.wasPicked.some(function (rubric, index, array) {
					return rubric === element;
				});
			}
			if (wasPicked === true) return;

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

	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			var wasPicked = null;
			if (GAME.wasPicked) {
				wasPicked = GAME.wasPicked.some(function (rubric, index, array) {
					return rubric === element;
				});
			}
			if (wasPicked === true) return;

			if (item === element) {

				for (var actions in GAME.json[item].action) {
					GAME.actions.push(GAME.json[item].action[actions]);
				}

			}

		}

	});
};

// 4.
;function updateGameContent() {

		for (var item in GAME.json) {

			for (var actions in GAME.json[item].action) {

				var content = GAME.json[item].action[actions];

				GAME.content.actions[item].push(content);
			}

		}

		for (var item in GAME.json) {


				for (var truth in GAME.json[item].true) {

					var content = GAME.json[item].true[truth];

					GAME.content.truth[item].push(content);
				}

		}

};

// 3.
;function updateAllTruthActions() {

	updateTruth();
	updateAction();
	updateGameContent();

};
/* ======================================

Получение json'а с вопросами

====================================== */


;function getJson() {

	var jsonPath = 'assets/response.json',
		jsonV = localStorage.getItem('gamev') || null;

	// если офлайн режим
	if ( !navigator.onLine || (jsonV !== null && jsonV === v) ) {
		GAME.json = JSON.parse(localStorage.getItem('json'));
		GAME.jsonState = 2;
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

			if (localStorageTest()) {
				localStorage.setItem('json', JSON.stringify(data));
				localStorage.setItem('gamev', v);
			}

			// set json state to 2, it'means json is loaded
			sessionStorage.setItem('JSONINCURRENTSESSION', 2);

			// if json was loaded after game-start, hide preloader,
			// init game
			if ( preloader('getState') === 'visible' && GAME.jsonState === 2 && GAME.rubrics.length >= 1 ) {

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

/*

	Таблица результатов

*/

;(function () {




})();
/* ==================================

Этот файл содержит рендет шаблоны

1. Шаблон для создания игрока в начале игры
2. Шаблон для создания игрока в игре
3. Шаблон действия / вопроса для game-list
4. Шаблон названия рубрики и кнопки для game-list

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
	},

	// 3.
	gameListItem: function (content, state) {

		if ( content.slice(-1) === '+' ||
			 content.slice(-1) === ';' ||
			 content.slice(-1) === '#') {

			content = content.slice(0, -1);

		}

		var template = '<div data-game-list-item="" class="game-list_item {{checked}}">' + content +'<\/div>';
			template = state === true ? template.replace('{{checked}}', 'js-checked') : template.replace('{{checked}}', '');
			return template;
	},

	// 4.
	gameListHeader: function (rubric, type) {
		var template = '<h3 class="game-list_rubric_name">{{rubric}} +, {{type}}<span data-select-action="select" class="game-list_select"><span class="game-list_select_inner-text">Выбрать все<\/span><span class="game-list_select_inner-text">Отключить все<\/span><\/span><\/h3>';
			template = template.replace('{{rubric}}', rubric)
								.replace('{{type}}', type);
			return template;
	}

}

/* ==============================================

Лист выбора вопросов/действий

1. Добавление/удаление активного класса пунктам списка
3. Показ игрового листа
4. Запись вопросов / действий в html разметку
5. Клик на "Отменить" и "Сохранить кнопки"

============================================== */

;(function () {

	var container = document.querySelector('[data-game-list]'),
		checkClass = 'js-checked';

	container.addEventListener('click', function (event) {

		// click on list-item
		// 1.
		if ( event.target.getAttribute('data-game-list-item') === '' ) {

			var getElement = event.target;

			if ( getElement.classList.contains(checkClass) )
				getElement.classList.remove(checkClass);
			else
				getElement.classList.add(checkClass);

			return;

		}

	}, false);



})();


// 3.
;(function () {


	var triggerGameList = document.querySelectorAll('[data-show-game-list]'),
		gameList = document.querySelector('[data-game-list]'),
		hideClassList = document.querySelectorAll('[data-game-list-hide]');

	bindListeners(triggerGameList, 'mousedown', function (event, element) {

		preloader('show');

		var timeOutInitMarkup = setTimeout(function () {

			if ( gameListStateGet() !== 2 ) {

				gameListMarkUp();
				timeOut();

			} else if ( gameListStateGet() === 2 ) {

				gameList.classList.add('visible');
				preloader('hide');

			}

		}, 600);

		;function timeOut() {

			var timeOut = setTimeout(function () {

				preloader('hide');
				gameList.classList.add('visible');

			}, 2400);

		};

	});

})();


// 4.
;function gameListMarkUp() {

	gameListStateSet(1);

/*

	template['16'] = [@16+ truth compiled html string, @16+ action compiled html string]
	template['18'] = [@18+ truth compiled html string, @18+ action compiled html string]
	template['21'] = [@21+ truth compiled html string, @21+ action compiled html string]

*/

	var template = {
		'16': ['', ''],
		'18': ['', ''],
		'21': ['', '']
	}

/*

	html compiled code
	Название рубрики
	titles['16'] = [@truth compiled header, @action compiled header]
	кнопка выключить / включить

*/

	var titles = {
		'16': ['', ''],
		'18': ['', ''],
		'21': ['', '']
	};

/*

	Avaliable rubrics

*/

	var type = GAME.rubrics;

/*

	Current questions and actions

*/

	var truth = GAME.truth,
		actions = GAME.actions;

/*

	Create all html templates
	to input in DOM

*/

	type.forEach( function (element, index, array) {

		var currentType = element;
		titles[currentType][0] += TEMPLATES.gameListHeader(currentType, 'правда');
		titles[currentType][1] += TEMPLATES.gameListHeader(currentType, 'действие');

		GAME.content.truth[element].forEach( function (element, index, array) {

			var currentItem = element;

			var isPlayed = truth.some( function (element, index, array) {

				return currentItem === element;

			});

			if ( isPlayed )
				template[currentType][0] += TEMPLATES.gameListItem(element, true);
			else
				template[currentType][0] += TEMPLATES.gameListItem(element, false);

		});

		GAME.content.actions[element].forEach( function (element, index, array) {

			var currentItem = element;

			var isPlayed = actions.some( function (element, index, array) {

				return currentItem === element;

			});

			if ( isPlayed )
				template[currentType][1] += TEMPLATES.gameListItem(element, true);
			else
				template[currentType][1] += TEMPLATES.gameListItem(element, false);

		});

		template[currentType][0] = titles[currentType][0] + template[currentType][0];
		template[currentType][1] = titles[currentType][1] + template[currentType][1];

	});

/*

	Insert markup

*/

	var gameListWrappers = document.querySelectorAll('[data-game-list-wrap]'),
		currentSection = null,
		targetWrap = null;

	[].forEach.call(gameListWrappers, function (element, index, array) {

		currentSection = element.getAttribute('data-game-list-wrap').replace(/ /g,'').split(',');
		targetWrap = element.querySelector('[data-game-list-item-wrap]');

		targetWrap.innerHTML = template[currentSection[0]][currentSection[1]];

	});

	selectDeselect();

	gameListStateSet(2);



};


// 5.
;(function () {

	var gameListCancel = document.querySelector('[data-game-list-action="cancel"]'),
		gameListSave = document.querySelector('[data-game-list-action="save"]'),
		gameList = document.querySelector('[data-game-list]');

		gameListCancel.addEventListener('mousedown', function (event) {

			gameList.classList.remove('visible');

		}, false);

		gameListSave.addEventListener('mousedown', function (event) {

			gameListSaveChecked();
			gameList.classList.remove('visible');

		});

})();
/* =====================================

Показ модального окна
1. Открытие модального окна, данные content @ type берутся из функции getTruthOrAction(type);
2. Закрытие модального окна, проверка стриков

====================================== */
// 1.
;function showModal(content) {

	var modal = document.querySelector('[data-game-modal]'),
		nextQA = document.querySelector('[data-game-modal-next]');

	nextQA.removeAttribute('data-disabled');

	var modalText = modal.querySelector('[data-game-modal-content]');
	modalText.innerHTML = content.text;


	var timeout = function () {

		modal.classList.remove('hidden');
		modal.classList.add('active');

	};


	Overlay.show(timeout);

	if (content.class && content.class.length >= 1) {
		modal.classList.add(content.class);
	}


};

// 2.
;function closeModal() {

	var modal = document.querySelector('[data-game-modal]'),
		truthButton = document.querySelector('[data-showmodal-button="truth"]'),
		actionsButton = document.querySelector('[data-showmodal-button="actions"]');

	modal.classList.remove('active');
	var hideModal = function () {
		modal.classList.add('hidden');
	}
	Overlay.hide(hideModal);

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


};
/* =======================================

Рендер новых игроков в облако игроков

========================================= */


var updateMainPlayersCloud = function () {

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

};
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
	document.addEventListener('mousedown', function (event) {
		if (!event.target.hasAttribute('data-gamestart-nextmodal')) return;
		currentModal = event.target.closest('[data-gamestart-modal]');
		gameStartNextModal = currentModal.nextSibling;
		currentModal.classList.add('hidden');
		gameStartNextModal.classList.add('active');
	}, false);

	// Prev button
	// 1.2.
	document.addEventListener('mousedown', function (event, element) {
		if (!event.target.hasAttribute('data-gamestart-prevmodal')) return;
		currentModal = event.target.closest('[data-gamestart-modal]');
		gameStartPrevModal = currentModal.previousSibling;
		currentModal.classList.remove('active');
		gameStartPrevModal.classList.remove('hidden');
	}, false);

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

	if (checkPlayers()) {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');
	} else {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');
	}


};

;function checkPlayers() {
	return (document.querySelectorAll('[data-gamestart-player]').length >= 2 &&
	 document.querySelectorAll('[data-gamestart-player-gender="m"]').length >= 1 &&
	 document.querySelectorAll('[data-gamestart-player-gender="f"]').length >= 1);
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

	if (checkPlayers()) {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').removeAttribute('data-disabled');
	} else {
		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-newplayer-modal-button]').setAttribute('data-disabled', '');
	}

};

;(function () {

	document.addEventListener('mousedown', function (event) {
		if (event.target.hasAttribute('data-gamestart-player-remove')) {
			gameStartPlayerDelete(event.target.parentNode);
		}
	}, false);

})();


// 4.
;function gameStartRubricSelect() {

	var checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	bindListeners(checkboxes, 'change', function (event, element) {
		// reset Rubrics
		GAME.rubrics = [];
		checkRubric();


		// update picked rubrics
		[].forEach.call(checkboxes, function (element, index, array) {
			if (element.checked)
				GAME.rubrics.push(element.value);
		});

	});

};


var checkRubric = function () {
	var checkboxes = document.querySelectorAll('[data-gamestart-rubric]'),
	checked = [].some.call(checkboxes, function (checkbox, index, array) {
		return checkbox.checked;
	});
	if (checked === true) {
		document.querySelector('[data-rubricselect-modal-button]').removeAttribute('data-disabled');
	}
	else {
		document.querySelector('[data-rubricselect-modal-button]').setAttribute('data-disabled', '');
	}
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
		gameState: 0,
		content: {
			truth: {
				'16': [],
				'18': [],
				'21': []
			},
			actions: {
				'16': [],
				'18': [],
				'21': []
			}
		}
	}


};
/*

	Вызов модальных окон
	- Смена рубрики
	- Добавление/удаление игроков
*/


;(function () {

var UpdateModals = function () {
	this.trigger = 'data-show-default-modal';
	this.start = document.querySelector('[data-gamestart]');
	this.attributes = [
		'data-gamenewplayer-save',
		'data-rubric-save',
		'data-rules-save'
	];
	this.playerContainer = document.querySelector('[data-gamestart-playercontainer]');
	this.modals = document.querySelectorAll('[data-gamestart-modal]');
};

UpdateModals.prototype.init = function(callback) {
	var UpdateModals = this;
	document.addEventListener('mousedown', function (event) {
		if (UpdateModals.checkTrigger(event.target)) {
			var target = event.target.hasAttribute(UpdateModals.trigger) ?
			event.target :
			event.target.parentNode;
			UpdateModals.showModal(target);
		}
	}, false);
	if (callback) callback();
};


UpdateModals.prototype.updateHTML = function(callback) {
	var newPlayerSave = document.querySelector('[data-newplayer-modal-button]'),
		rubricSelectSave = document.querySelector('[data-rubricselect-modal-button]'),
		rubricSelectHide = rubricSelectSave.parentNode.querySelector('[data-gamestart-prevmodal]'),
		rules = document.querySelector('[data-rules-modal]'),
		rulesBack = rules.querySelector('[data-gamestart-prevmodal]'),
		rulesNext = rules.querySelector('[data-gamestart-nextmodal]'),
		removeAttr = 'data-gamestart-nextmodal';

	newPlayerSave.innerHTML = 'Сохранить';
	newPlayerSave.removeAttribute(removeAttr);
	newPlayerSave.setAttribute(this.attributes[0], null);
	rubricSelectSave.innerHTML = 'Сохранить';
	rubricSelectSave.removeAttribute(removeAttr);
	rubricSelectSave.setAttribute(this.attributes[1], null);
	rubricSelectSave.classList.remove('next-back');
	rubricSelectHide.remove();
	rulesBack.remove();
	rulesNext.innerHTML = 'Ок';
	rulesNext.removeAttribute(removeAttr);
	rulesNext.setAttribute(this.attributes[2], null);

	[].forEach.call(this.modals, function (modal, index, array) {
		modal.classList.add('hidden');
	});

	if (callback) callback.call(this);
};

UpdateModals.prototype.checkTrigger = function(target) {
	return (target.hasAttribute(this.trigger) || target.parentNode.hasAttribute(this.trigger));
};

UpdateModals.prototype.showModal = function(modal) {
	var target = modal.getAttribute(this.trigger),
	modal = document.querySelector('[' + target + ']');
	this.start.classList.remove('visibility');
	this.start.classList.remove('hidden');
	modal.classList.remove('hidden');
	modal.classList.add('active');
};

UpdateModals.prototype.updatePlayer = function() {
	var UpdateModals = this,
	template = '';
	GAME.players.forEach(function (player, index, array) {
		template += TEMPLATES.gameStartCreatePlayer(player.gender, player.name);
	});
	this.playerContainer.innerHTML = template;
	if (checkPlayers()) {
		document
			.querySelector('[data-newplayer-modal-button]')
			.removeAttribute('data-disabled');
	} else {
		document
			.querySelector('[data-newplayer-modal-button]')
			.setAttribute('data-disabled', null);
	}
};

UpdateModals.prototype.updateRubric = function() {
	GAME.rubrics.forEach(function (value, index, array) {
		document.querySelector('[value="' + value + '"]').checked = true;
	});
	GAME.wasPicked = GAME.rubrics;
	checkRubric();
};

UpdateModals.prototype.bind = function() {
	var UpdateModals = this;
	this.updateRubric();
	this.updatePlayer();
	document.addEventListener('mousedown', function (event) {
		var target = event.target;
		if (target.hasAttribute(UpdateModals.attributes[0])) {
			SavePlayers(document.querySelectorAll('[data-gamestart-player]'), 'data-gameStart-player-gender');
			updateMainPlayersCloud();
			saveGameState();
			UpdateModals.closeModal(target.parentNode);
			Overlay.hide(Sidebar.hide);
		}
		if (target.hasAttribute(UpdateModals.attributes[1])) {
			updateAllTruthActions();
			saveGameState();
			UpdateModals.closeModal(target.parentNode.parentNode);
			Overlay.hide(Sidebar.hide);
		}
	}, false);
};

UpdateModals.prototype.closeModal = function(modal, callback) {
	var timeout = null
	UpdateModals = this;
	modal.classList.add('hidden');
	timeout = setTimeout(function() {
		document.querySelector('[data-gamestart]').classList.add('visibility');
		if (callback) callback.call(UpdateModals);
	}, 1000);
};

window.UpdateModals = new UpdateModals();
window.UpdateModals.init();

})();

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


;(function () {

	var Overlay = function () {
		this.self = document.querySelector('[data-game-overlay]');
		this.states = ['hidden', 'active'];
		this.timeout = 600;
		this.listener = false;
	};



	Overlay.prototype.show = function(callback, close) {
		this.self.classList.remove(this.states[0]);
		this.self.classList.add(this.states[1]);
		var timeout = null,
		overlay = this;
		if (close && typeof close === 'function') {
			this.self.addEventListener('mousedown', function (event) {
				overlay.hide(null, arguments);
				overlay.listener = true;
				close();
			}, false);
		}
		if (!callback || callback === null) return;
		else { timeout = setTimeout(function() { callback(); }, overlay.timeout); }
	};



	Overlay.prototype.hide = function(callback, args) {
		var overlay = this,
		timeout = null;

		this.self.classList.remove(this.states[1]);
		timeout = setTimeout(function () {
			overlay.self.classList.add(overlay.states[0]);
			if (overlay.listener === true) { overlay.self.removeEventListener('mousedown', args.callee, false); overlay.listener = false; }
			if (callback && callback !== null) { callback(); }
		}, overlay.timeout);
	};

	window.Overlay = new Overlay();

})();


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
		links = document.querySelectorAll('.sidebar_link'),
		body = document.querySelector('body');

	// because android 4.3 and lower not support
	// classList.toggle
	var sidebarClose = function () {
		toggleButton.classList.remove('active');
		sidebar.classList.remove('active');
		header.classList.remove('active');
		body.classList.remove('sidebared');
	};

	var sidebarOpen = function () {
		toggleButton.classList.add('active');
		sidebar.classList.add('active');
		header.classList.add('active');
		body.classList.add('sidebared');
	};

	toggleButton.addEventListener('mousedown', function (event) {

		if ( toggleButton.classList.contains('active') ) {

			sidebarClose();
			Overlay.hide();

		} else {

			sidebarOpen();
			Overlay.show(null, sidebarClose);

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

	var Sidebar = function () {};

	Sidebar.prototype.hide = function() {
		sidebarClose();
	};

	Sidebar.prototype.show = function() {
		sidebarOpen();
	};

	window.Sidebar = new Sidebar();


})();