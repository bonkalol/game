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