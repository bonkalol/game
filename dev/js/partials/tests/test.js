/* ============================

Запуск теста

1. Переменная которая хранит результаты теста
2. Создание результата теста
3.

============================== */

// 1.
var TEST = {
	results: [],
	succes: 0,
	errored: 0
};

// 2.
var Results = {

	constructor: function(testName, testStatus) {
		this.name = testName;
		this.status = testStatus;
		return this;
	}

}


// Запуск теста
;function runTests() {

	TEST = {
		results: [],
		succes: 0,
		errored: 0
	};

	console.log('===================== STARTING TESTS =====================');

	jsonTest();
	testAddPlayersView();
	testAddPlayersLogic();
	testRubricSelect();

	TEST.results.forEach( function (element, index, array) {

		console.log('TEST: " ' + element.name.toUpperCase() + ' " , TEST STATUS: <<<< ' + element.status.toUpperCase() + ' >>>>');

	});

	console.log('===================== ENDING TESTS =====================');


};
