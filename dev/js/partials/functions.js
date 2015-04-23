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
;function saveGameState() {

	if (localStorageTest()) {
		localStorage.setItem('info', JSON.stringify(GAME));
	} else {
		return;
	}

};