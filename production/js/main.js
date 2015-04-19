/* =========================================

functions.js - включает в себя различные вспомогательные функции


1. disableElements(); - Выключает все неактивные елементы
2. saveGameState(); - Сохранение текущего состояния игры

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
function saveGameState() {

	if (localStorageTest()) {
		localStorage.setItem('info', JSON.stringify(GAME));
	} else {
		return;
	}

};
/* ============================================

Всякий usefull стаф, вспомогательные функции которые
никак не относятся к приложению, а только упрощают написание кода

1. bindListeners(elements, listener, callback); - Функция которая обходит массив элементов и всем биндит
заданный эвент

2. Element.closest полифил

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
	json: {}
}
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

/* ======================================

Здесь происходит инициализация игры

1. Инциализация игры, вызов рендера игрока, инициализация функции выдачи вопросов,
запись вопросов/действий в GAME.truth/GAME.actions

1.1. Рендер игроков в облако игроков
1.2. Запись вопрос и действий в GAME.truth/GAME.actions по выбраным рубрикам
1.3. Выбор игрока, который ходит

======================================= */


// 1.
;function gameInit() {

	// 1.1. 
	updateMainPlayersCloud();

	// 1.2.
	updateAllTruthActions();

	// 1.3.
	nextPlayer();


};
/* =============================

Отвечает за показ модального окна и выдачей в него html вопроса/действия

1. Вешаем эвент листенеры на кнопки выбора правды или действия
2. Выбираем правду или действие, выбранный вопрос удаляем из массива, если
вопросы или действие кончились, обновляем
3. Определяем тип карточки
3.1. Знак +, надо выбрать игрока противоположного пола и подставить как цель
3.2. Знак #, серая карточка, не читать задание в слух и выполнять действие чтобы игроки не догадывались
3.3. Знак ;, серая карточка, коллективное задание - выполняют все
4. Показываем модальное окно с выбранным вопросом, действием
5. Добавление вопроса, действия в стрик
6. Проверка доступности вопросов/действий

============================= */

// 1.
;(function buttonEvents() {

	var truthButton = document.querySelector('[data-truth-button]'),
		actionButton = document.querySelector('[data-action-button]'),
		closePopupButton = document.querySelector('[data-game-modalclose-button]');


		truthButton.addEventListener('mousedown', function(event) {

			getTruthOrAction('truth');

		});

		actionButton.addEventListener('mousedown', function(event) {

			getTruthOrAction('actions');

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

		if ( type === 'truth' ) {

			addStreak(type);
			console.log(GAME.currentPlayer, 'picked ' + type);

			if ( GAME.truth.length === 0 )
				updateTruth();
		}

		if ( type === 'actions' ) {

			addStreak(type);
			console.log(GAME.currentPlayer, 'picked ' + type);

			if ( GAME.actions.length === 0 )
				updateAction();
		}

		var content = cardType(text); 
		console.log(content);

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

	if (truthCount === max)
		status = {truth: false, actions: true};

	if (actionsCount === max)
		status = {truth: true, actions: false};

	else if (truthCount !== max && actionsCount !== max)
		status = {truth: true, actions: true};

	// console.log(status);
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

2. gameStartSavePlayers(); - сохранение игроков в переменную GAME.players

3. Проверка, был ли добавлен такой игрок

4. Закрываем game_start, качаем json, инициализируем игру

=============================================== */

// 1. 
;(function gameStartLogic() {

	var gameStartPlayerInput = document.querySelector('[data-gamestart-playerInput]'),
		gameStartPlayerButtonAdd = document.querySelector('[data-gamestart-playerAdd]'),
		gameStartPlayerGenderSelect = document.querySelectorAll('[data-gamestart-genderRadio]'),
		gameStartPlayerGender = null;

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

			gameStartSavePlayers();

		});


})();

// 2.
;function gameStartSavePlayers() {

	var gameStartPlayers = document.querySelectorAll('[data-gamestart-player]'),
		playerName = '',
		playerGender = '';

	// reset GAME.player for rewrite
	GAME.players = [];

	// update GAME.players
	[].forEach.call(gameStartPlayers, function (element, index, array) {

		playerName = element.innerText || element.textContent;
		playerGender = element.getAttribute('data-gameStart-player-gender');

		var player = {
			name: playerName,
			gender: playerGender,
			actionsStreak: 0,
			truthStreak: 0,
			isCurrentPlayer: false
		}

		GAME.players.push(player);

		if (player.gender === 'f')
			GAME.playersF.push(player);

		if (player.gender === 'm')
			GAME.playersM.push(player);

	});

};

// 3.
;function gameStartCheckPlayerExist(input) {

	var isExist = false;

	GAME.players.some( function (element, index, array) {

		if (element.name === input.value) {
			isExist = true;
			return false;
		}

	});

	if (isExist === true) {
		return true;
	} else {
		return false;
	}

};


// 4.
;function gameStartClose() {

	var gameStartWrap = document.querySelector('[data-gamestart]'),
		timeout = null;

	gameStartWrap.classList.add('hidden');

	timeout = setTimeout(function() {

		gameStartWrap.classList.add('visibility');

	}, 600);

	getJson();

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

	preloader('show');
	var request = new XMLHttpRequest();
	request.open('GET', 'assets/response.json', true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			GAME.json = data;

			if (localStorageTest())
				localStorage.setItem('json', JSON.stringify(data));
			// init game
			gameInit();
			// hide preloader
			preloader('hide');
		} else {
			// We reached our target server, but it returned an error
			// throw error
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

==================================== */

var TEMPLATES = {

	// 1.
	gameStartCreatePlayer: function(gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			template = '<span class="game-start_player game-start_player--' + genderClass + 'male' + '" data-gameStart-player-gender="' + gender + '" data-gamestart-player>';
			template +=  name + '<span class="game-start_player-remove" data-gamestart-player-remove><\/span><\/span>';
			return template;
	},

	// 2.
	player: function(gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			avatar = gender === 'm' ? 'business' : 'woman',
			template = '<div class="player_item player_item--' + genderClass + 'male"><div class="player_item_avatar player_item_avatar--' + genderClass + 'male"><svg width="22px" height="22px"><use xlink:href="#' + avatar + '"><\/use><\/svg><\/div><div class="player_item_name">' + name + '<\/div><\/div>';
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
		truthButton = document.querySelector('[data-truth-button'),
		actionsButton = document.querySelector('[data-action-button]');

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
		htmlString = '';

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
;(function gameStartView() {


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

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').removeAttribute('data-disabled');

	} else {

		gameStartPlayersContainer.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').setAttribute('data-disabled', '');

	}


};


// 3.
;function gameStartPlayerDelete(sender) {

	sender.remove();

};



;function gameStartPlayerDeleteBind() {

	var gameStartPlayerButtonDelete = document.querySelectorAll('[data-gamestart-player]');
	// 3.
	bindListeners(gameStartPlayerButtonDelete, 'click', function (event, element) {

		gameStartPlayerDelete(element.closest('[data-gamestart-player]'));

	});
};


// 4.
;(function gameStartRubricSelect() {

	var checkboxes = document.querySelectorAll('[data-gamestart-rubric]');

	bindListeners(checkboxes, 'change', function (event, element) {
		// reset Rubrics
		GAME.rubrics = [];

		if (isChecked(checkboxes))
			element.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').removeAttribute('data-disabled');
		else
			element.closest('[data-gamestart-modal]').querySelector('[data-gamestart-nextmodal]').setAttribute('data-disabled', '');

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

})();

window.onload = function(event) {

	preloader('hide');

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
	}


};
;(function sidebar() {

	var toggleButton = document.querySelector('[data-sidebar-toggle]'),
		sidebar = document.querySelector('.sidebar'),
		header = document.querySelector('.header');


	toggleButton.addEventListener('mousedown', function(event) {

		toggleButton.classList.toggle('active');
		sidebar.classList.toggle('active');
		header.classList.toggle('active');

	});


})();