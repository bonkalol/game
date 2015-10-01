/* ======================================

Здесь происходит инициализация игры

1. Инциализация игры, вызов рендера игрока, инициализация функции выдачи вопросов,
запись вопросов/действий в GAME.truth/GAME.actions

1. Сохранение данных в LocalStorage
1.1. Рендер игроков в облако игроков
1.2. Запись вопрос и действий в GAME.truth/GAME.actions по выбраным рубрикам
Если это рестарт предъидущей игры, не обновлять вопросы
1.3. Выбор игрока, который ходит
1.4. Обновляем модальные окна
1.5. Сообщаем о том что игра начата

======================================= */


// 1.
;function gameInit(type) {

	// 1.
	saveGameState();

	// 1.1. 
	updateMainPlayersCloud();
	// 1.2.
	if ( type !== 'restart' ) {
		updateAllTruthActions();
	}
	// 1.3.
	nextPlayer();

	// 1.4.
	UpdateModals.updateHTML(UpdateModals.bind);

	// 1.5.
	GAME.game = true;

	Playerlist.render();

};