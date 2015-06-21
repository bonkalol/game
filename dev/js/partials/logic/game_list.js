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
// ;(function () {

// 	gameListStateSet(0);

// })();

// ;function gameListStateSet(value) {

// 	sessionStorage.setItem('GAMELISTSTATE', value);

// };

// ;function gameListStateGet() {

// 	return parseInt(sessionStorage.getItem('GAMELISTSTATE'));

// };

// // 1.
// ;function selectDeselect() {

// 	var target = null,
// 		targetAttr = null,
// 		listItems = null,
// 		selectDeselectButton = document.querySelectorAll('[data-select-action]'),
// 		checkClass = 'js-checked';

// 	bindListeners(selectDeselectButton, 'mousedown', function (event, element) {

// 		target = element;
// 		listItems = target.closest('[data-game-list-wrap]').querySelectorAll('[data-game-list-item]');
// 		targetAttr = target.getAttribute('data-select-action');


// 		if ( targetAttr === 'select' ) {

// 			[].forEach.call(listItems, function (element, index, array) {

// 				element.classList.add(checkClass);
// 				target.setAttribute('data-select-action', 'deselect');


// 			});

// 			return;

// 		}

// 		if ( targetAttr === 'deselect' ) {

// 			[].forEach.call(listItems, function (element, index, array) {

// 				element.classList.remove(checkClass);
// 				target.setAttribute('data-select-action', 'select');


// 			});

// 			return;

// 		}

// 	});

// };


// ;function gameListSaveChecked() {

// 	var truthContainers = document.querySelectorAll('[data-game-list-wrap$="0"]'),
// 		actionContainers = document.querySelectorAll('[data-game-list-wrap$="1"]');
// 	GAME.truth = [];
// 	GAME.actions = [];

// 	[].forEach.call(truthContainers, function (element, index, array) {

// 		var items = element.querySelectorAll('[data-game-list-item].js-checked');

// 		[].forEach.call(items, function (element, index, array) {

// 			var text = element.innerText || element.textContent;

// 			GAME.truth.push(text);

// 		});

// 	});

// 	[].forEach.call(actionContainers, function (element, index, array) {

// 		var items = element.querySelectorAll('[data-game-list-item].js-checked');

// 		[].forEach.call(items, function (element, index, array) {

// 			var text = element.innerText || element.textContent;

// 			GAME.actions.push(text);

// 		});

// 	});

// 	if ( GAME.truth.length === 0 ) {
// 		updateTruth();
// 	}

// 	if ( GAME.actions.length === 0 ) {
// 		updateAction();
// 	}

// };