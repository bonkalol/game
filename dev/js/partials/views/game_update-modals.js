/*

	Вызов модальных окон
	- Смена рубрики
	- Добавление/удаление игроков
*/


;(function () {

var UpdateModals = function () {
	this.trigger = 'data-show-default-modal';
	this.start = document.querySelector('[data-gamestart]');
	this.attributes = [
		'data-gamenewplayer-save',
		'data-rubric-save',
		'data-rules-save'
	];
	this.playerContainer = document.querySelector('[data-gamestart-playercontainer]');
	this.modals = document.querySelectorAll('[data-gamestart-modal]');
};

UpdateModals.prototype.init = function(callback) {
	var UpdateModals = this;
	document.addEventListener('mousedown', function (event) {
		if (UpdateModals.checkTrigger(event.target)) {
			var target = event.target.hasAttribute(UpdateModals.trigger) ?
			event.target :
			event.target.parentNode;
			UpdateModals.showModal(target);
		}
	}, false);
	if (callback) callback();
};


UpdateModals.prototype.updateHTML = function(callback) {
	var newPlayerSave = document.querySelector('[data-newplayer-modal-button]'),
		rubricSelectSave = document.querySelector('[data-rubricselect-modal-button]'),
		rubricSelectHide = rubricSelectSave.parentNode.querySelector('[data-gamestart-prevmodal]'),
		rules = document.querySelector('[data-rules-modal]'),
		rulesBack = rules.querySelector('[data-gamestart-prevmodal]'),
		rulesNext = rules.querySelector('[data-gamestart-nextmodal]'),
		removeAttr = 'data-gamestart-nextmodal';

	newPlayerSave.innerHTML = 'Сохранить';
	newPlayerSave.removeAttribute(removeAttr);
	newPlayerSave.setAttribute(this.attributes[0], null);
	rubricSelectSave.innerHTML = 'Сохранить';
	rubricSelectSave.removeAttribute(removeAttr);
	rubricSelectSave.setAttribute(this.attributes[1], null);
	rubricSelectSave.classList.remove('next-back');
	rubricSelectHide.remove();
	rulesBack.remove();
	rulesNext.innerHTML = 'Ок';
	rulesNext.removeAttribute(removeAttr);
	rulesNext.setAttribute(this.attributes[2], null);

	[].forEach.call(this.modals, function (modal, index, array) {
		modal.classList.add('hidden');
	});

	if (callback) callback.call(this);
};

UpdateModals.prototype.checkTrigger = function(target) {
	return (target.hasAttribute(this.trigger) || target.parentNode.hasAttribute(this.trigger));
};

UpdateModals.prototype.showModal = function(modal) {
	var target = modal.getAttribute(this.trigger),
	modal = document.querySelector('[' + target + ']');
	this.start.classList.remove('visibility');
	this.start.classList.remove('hidden');
	modal.classList.remove('hidden');
	modal.classList.add('active');
};

UpdateModals.prototype.updatePlayer = function() {
	var UpdateModals = this,
	template = '';
	GAME.players.forEach(function (player, index, array) {
		template += TEMPLATES.gameStartCreatePlayer(player.gender, player.name);
	});
	this.playerContainer.innerHTML = template;
	if (checkPlayers()) {
		document
			.querySelector('[data-newplayer-modal-button]')
			.removeAttribute('data-disabled');
	} else {
		document
			.querySelector('[data-newplayer-modal-button]')
			.setAttribute('data-disabled', null);
	}
};

UpdateModals.prototype.updateRubric = function() {
	GAME.rubrics.forEach(function (value, index, array) {
		document.querySelector('[value="' + value + '"]').checked = true;
	});
	GAME.wasPicked = GAME.rubrics;
	checkRubric();
};

UpdateModals.prototype.bind = function() {
	var UpdateModals = this;
	this.updateRubric();
	this.updatePlayer();
	document.addEventListener('mousedown', function (event) {
		var target = event.target;
		if (target.hasAttribute(UpdateModals.attributes[0])) {
			SavePlayers(document.querySelectorAll('[data-gamestart-player]'), 'data-gameStart-player-gender');
			updateMainPlayersCloud();
			saveGameState();
			UpdateModals.closeModal(target.parentNode);
			Overlay.hide(Sidebar.hide);
		}
		if (target.hasAttribute(UpdateModals.attributes[1])) {
			updateAllTruthActions();
			saveGameState();
			UpdateModals.closeModal(target.parentNode.parentNode);
			Overlay.hide(Sidebar.hide);
		}
	}, false);
};

UpdateModals.prototype.closeModal = function(modal, callback) {
	var timeout = null
	UpdateModals = this;
	modal.classList.add('hidden');
	timeout = setTimeout(function() {
		document.querySelector('[data-gamestart]').classList.add('visibility');
		if (callback) callback.call(UpdateModals);
	}, 1000);
};

window.UpdateModals = new UpdateModals();
window.UpdateModals.init();

})();
