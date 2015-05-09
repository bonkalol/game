/* ======================================

Получение json'а с вопросами

====================================== */


;function getJson() {

	// если офлайн режим
	if ( !navigator.onLine ) {
		GAME.json = JSON.parse(localStorage.getItem('json'));
		gameInit();
		return;
	}

	var request = new XMLHttpRequest();
	request.open('GET', 'assets/response.json', true);

	GAME.jsonState = 1;
	sessionStorage.setItem('JSONINCURRENTSESSION', 1);

	request.onload = function() {

		if (request.status >= 200 && request.status < 400) {

			var data = JSON.parse(request.responseText);
			GAME.json = data;

			if (localStorageTest())
				localStorage.setItem('json', JSON.stringify(data));

			// set json state to 2, it'means json is loaded
			GAME.jsonState = 2;
			sessionStorage.setItem('JSONINCURRENTSESSION', 2);

			// if json was loaded after game-start, hide preloader,
			// init game
			if ( preloader('getState') === 'visible' && GAME.gameState === 1 ) {

				preloader('hide');
				gameInit();

			}

		}
	};

	request.onerror = function() {
		// throw error
	};

	request.send();


};
