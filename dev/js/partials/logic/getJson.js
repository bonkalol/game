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
