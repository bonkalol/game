/* ======================================

В этом файле происходит запись действий/вопросов в GAME.truth/GAME.actions

1. Добавление правды
2. Добавление действий
3. Добавление и действий и вопросов

PS Разделено на несколько функций для удобства обновлений вопрос или действий

======================================= */

// 1.
;function updateTruth() {

	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			if (item === element) {

				for (var truth in GAME.json[item].true) {
					GAME.truth.push(GAME.json[item].true[truth]);
				}

			}

		}

	});

};

// 2.
;function updateAction() {


	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

			if (item === element) {

				for (var actions in GAME.json[item].action) {
					GAME.actions.push(GAME.json[item].action[actions]);
				}

			}

		}

	});
};


;function updateAllTruthActions() {

	updateTruth();
	updateAction();

};