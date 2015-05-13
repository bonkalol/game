/* ====================================

Загружен и сохранен ли json

==================================== */

;function jsonTest() {

	if (
		GAME.jsonState === 2 &&
		GAME.json &&
		parseInt(sessionStorage.getItem('JSONINCURRENTSESSION')) === 2 &&
		JSON.parse(localStorage.getItem('json'))) {

		TEST.results.push(Object.create(Results).constructor('Json loaded', 'success'));

	} else {

		TEST.results.push(Object.create(Results).constructor('Json loaded', 'fail'));

	}

};