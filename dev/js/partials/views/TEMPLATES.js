/* ==================================

Этот файл содержит рендет шаблоны

1. Шаблон для создания игрока в начале игры
2. Шаблон для создания игрока в игре
3. Шаблон модального окна с созданием/удалением игроков

==================================== */

var TEMPLATES = {

	// 1.
	gameStartCreatePlayer: function (gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			template = '<span class="game-start_player game-start_player--' + genderClass + 'male' + '" data-gameStart-player-gender="' + gender + '" data-gamestart-player>';
			template +=  name + '<span class="game-start_player-remove" data-gamestart-player-remove><\/span><\/span>';
			return template;
	},

	// 2.
	player: function (gender, name) {
		var genderClass = gender === 'm' ? '' : 'fe',
			avatar = gender === 'm' ? 'business' : 'woman',
			template = '<div class="player_item player_item--' + genderClass + 'male" data-game-player><div class="player_item_avatar player_item_avatar--' + genderClass + 'male"><svg width="22px" height="22px"><use xlink:href="#' + avatar + '"><\/use><\/svg><\/div><div class="player_item_name">' + name + '<\/div><\/div>';
			return template;
	}


}
