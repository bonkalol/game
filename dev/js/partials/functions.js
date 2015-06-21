/* =========================================

functions.js - включает в себя различные вспомогательные функции


1. disableElements(); - Выключает все неактивные елементы
2. saveGameState(); - Сохранение текущего состояния игры
3. Проверка был ли загружен json в данной сессии, если да, то вернет первый аргумент, если нет, то второй
4. Fix ipad/iphone height bug

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


// 4.
(function () {

	var iOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/);

	if( iOS ) {

		function iosVhHeightBug() {
			var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var content = document.querySelector('.main');
			content.style.height = height + 'px';
		}

		window.addEventListener('resize', function () {

			iosVhHeightBug();

		}, false);

		iosVhHeightBug();


	}


})();
