/* ==================================

Этот файл содержит рендет шаблоны

1. Шаблон для создания игрока в начале игры
2. Шаблон для создания игрока в игре
3. Шаблон действия / вопроса для game-list
4. Шаблон названия рубрики и кнопки для game-list

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
	},

	// 3.
	gameListItem: function (content, state) {

		if ( content.slice(-1) === '+' ||
			 content.slice(-1) === ';' ||
			 content.slice(-1) === '#') {

			content = content.slice(0, -1);

		}

		var template = '<div data-game-list-item="" class="game-list_item {{checked}}">' + content +'<\/div>';
			template = state === true ? template.replace('{{checked}}', 'js-checked') : template.replace('{{checked}}', '');
			return template;
	},

	// 4.
	gameListHeader: function (rubric, type) {
		var template = '<h3 class="game-list_rubric_name">{{rubric}} +, {{type}}<span data-select-action="select" class="game-list_select"><span class="game-list_select_inner-text">Выбрать все<\/span><span class="game-list_select_inner-text">Отключить все<\/span><\/span><\/h3>';
			template = template.replace('{{rubric}}', rubric)
								.replace('{{type}}', type);
			return template;
	},

	gamePickPlayer: function (gender, name) {
		var obj = {
			className: null,
			name: name,
			svg: null
		}
		if (gender === 'f') {
			obj.className = 'female';
			obj.svg = '#woman';
		} else {
			obj.className = 'male';
			obj.svg = '#business';
		}
		var template = '<div data-player-list-select class="player-list_item player-list_item--' + obj.className + '"><div class="player-list_name">' + obj.name + '<\/div><b class="player-list_icon"><svg width="26px" height="26px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + obj.svg + '"><\/use><\/svg><\/b><\/div>';
		return template;
	}

}
