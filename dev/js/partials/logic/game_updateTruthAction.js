/* ======================================

В этом файле происходит запись действий/вопросов в GAME.truth/GAME.actions

1. Добавление правды
2. Добавление действий
3. Добавление и действий и вопросов
4. Сохранение всех вопросов и действий в переменную GAME.content

PS Разделено на несколько функций для удобства обновлений вопрос или действий

======================================= */

// 1.
;function updateTruth() {

	GAME.rubrics.forEach(function (element, index, array) {

		for (var item in GAME.json) {

/*			var wasPicked = null;
			if (GAME.wasPicked) {
				wasPicked = GAME.wasPicked.some(function (rubric, index, array) {
					return rubric === element;
				});
			}
			if (wasPicked === true) return;*/

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

			// var wasPicked = null;
			// if (GAME.wasPicked) {
			// 	wasPicked = GAME.wasPicked.some(function (rubric, index, array) {
			// 		return rubric === element;
			// 	});
			// }
			// if (wasPicked === true) return;

			if (item === element) {

				for (var actions in GAME.json[item].action) {
					GAME.actions.push(GAME.json[item].action[actions]);
				}

			}

		}

	});
};

// 4.
;function updateGameContent() {

		for (var item in GAME.json) {

			for (var actions in GAME.json[item].action) {

				var content = GAME.json[item].action[actions];

				GAME.content.actions[item].push(content);
			}

		}

		for (var item in GAME.json) {


				for (var truth in GAME.json[item].true) {

					var content = GAME.json[item].true[truth];

					GAME.content.truth[item].push(content);
				}

		}

};

// 3.
;function updateAllTruthActions() {

	updateTruth();
	updateAction();
	updateGameContent();

};