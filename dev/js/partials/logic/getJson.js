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
