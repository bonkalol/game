/* ==============================================

Лист выбора вопросов/действий

1. Добавление/удаление активного класса пунктам списка
3. Показ игрового листа
4. Запись вопросов / действий в html разметку
5. Клик на "Отменить" и "Сохранить кнопки"

============================================== */

// ;(function () {

// 	var container = document.querySelector('[data-game-list]'),
// 		checkClass = 'js-checked';

// 	container.addEventListener('click', function (event) {

// 		// click on list-item
// 		// 1.
// 		if ( event.target.getAttribute('data-game-list-item') === '' ) {

// 			var getElement = event.target;

// 			if ( getElement.classList.contains(checkClass) )
// 				getElement.classList.remove(checkClass);
// 			else
// 				getElement.classList.add(checkClass);

// 			return;

// 		}

// 	}, false);



// })();


// // 3.
// ;(function () {


// 	var triggerGameList = document.querySelectorAll('[data-show-game-list]'),
// 		gameList = document.querySelector('[data-game-list]'),
// 		hideClassList = document.querySelectorAll('[data-game-list-hide]');

// 	bindListeners(triggerGameList, 'mousedown', function (event, element) {

// 		preloader('show');

// 		var timeOutInitMarkup = setTimeout(function () {

// 			if ( gameListStateGet() !== 2 ) {

// 				gameListMarkUp();
// 				timeOut();

// 			} else if ( gameListStateGet() === 2 ) {

// 				gameList.classList.add('visible');
// 				preloader('hide');

// 			}

// 		}, 600);

// 		;function timeOut() {

// 			var timeOut = setTimeout(function () {

// 				preloader('hide');
// 				gameList.classList.add('visible');

// 			}, 2400);

// 		};

// 	});

// })();


// // 4.
// ;function gameListMarkUp() {

// 	gameListStateSet(1);

// /*

// 	template['16'] = [@16+ truth compiled html string, @16+ action compiled html string]
// 	template['18'] = [@18+ truth compiled html string, @18+ action compiled html string]
// 	template['21'] = [@21+ truth compiled html string, @21+ action compiled html string]

// */

// 	var template = {
// 		'16': ['', ''],
// 		'18': ['', ''],
// 		'21': ['', '']
// 	}

// /*

// 	html compiled code
// 	Название рубрики
// 	titles['16'] = [@truth compiled header, @action compiled header]
// 	кнопка выключить / включить

// */

// 	var titles = {
// 		'16': ['', ''],
// 		'18': ['', ''],
// 		'21': ['', '']
// 	};

// /*

// 	Avaliable rubrics

// */

// 	var type = GAME.rubrics;

// /*

// 	Current questions and actions

// */

// 	var truth = GAME.truth,
// 		actions = GAME.actions;

// /*

// 	Create all html templates
// 	to input in DOM

// */

// 	type.forEach( function (element, index, array) {

// 		var currentType = element;
// 		titles[currentType][0] += TEMPLATES.gameListHeader(currentType, 'правда');
// 		titles[currentType][1] += TEMPLATES.gameListHeader(currentType, 'действие');

// 		GAME.content.truth[element].forEach( function (element, index, array) {

// 			var currentItem = element;

// 			var isPlayed = truth.some( function (element, index, array) {

// 				return currentItem === element;

// 			});

// 			if ( isPlayed )
// 				template[currentType][0] += TEMPLATES.gameListItem(element, true);
// 			else
// 				template[currentType][0] += TEMPLATES.gameListItem(element, false);

// 		});

// 		GAME.content.actions[element].forEach( function (element, index, array) {

// 			var currentItem = element;

// 			var isPlayed = actions.some( function (element, index, array) {

// 				return currentItem === element;

// 			});

// 			if ( isPlayed )
// 				template[currentType][1] += TEMPLATES.gameListItem(element, true);
// 			else
// 				template[currentType][1] += TEMPLATES.gameListItem(element, false);

// 		});

// 		template[currentType][0] = titles[currentType][0] + template[currentType][0];
// 		template[currentType][1] = titles[currentType][1] + template[currentType][1];

// 	});

// /*

// 	Insert markup

// */

// 	var gameListWrappers = document.querySelectorAll('[data-game-list-wrap]'),
// 		currentSection = null,
// 		targetWrap = null;

// 	[].forEach.call(gameListWrappers, function (element, index, array) {

// 		currentSection = element.getAttribute('data-game-list-wrap').replace(/ /g,'').split(',');
// 		targetWrap = element.querySelector('[data-game-list-item-wrap]');

// 		targetWrap.innerHTML = template[currentSection[0]][currentSection[1]];

// 	});

// 	selectDeselect();

// 	gameListStateSet(2);



// };


// // 5.
// ;(function () {

// 	var gameListCancel = document.querySelector('[data-game-list-action="cancel"]'),
// 		gameListSave = document.querySelector('[data-game-list-action="save"]'),
// 		gameList = document.querySelector('[data-game-list]');

// 		gameListCancel.addEventListener('mousedown', function (event) {

// 			gameList.classList.remove('visible');

// 		}, false);

// 		gameListSave.addEventListener('mousedown', function (event) {

// 			gameListSaveChecked();
// 			gameList.classList.remove('visible');

// 		});

// })();