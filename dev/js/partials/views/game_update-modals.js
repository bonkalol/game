/*

	Вызов модальных окон
	- Смена рубрики
	- Добавление/удаление игроков

*/


;(function () {

var UpdateModals = function () {
	this.trigger = 'data-show-default-modal';
	this.start = document.querySelector('[data-gamestart]');
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
	newPlayerSave.setAttribute('data-gamenewplayer-save', null);
	rubricSelectSave.innerHTML = 'Сохранить';
	rubricSelectSave.removeAttribute(removeAttr);
	rubricSelectSave.setAttribute('data-rubric-save', null);
	rubricSelectHide.remove();
	rulesBack.remove();
	rulesNext.innerHTML = 'Ок';
	rulesNext.removeAttribute(removeAttr);
	rulesNext.setAttribute('data-rules-save', null);


	if (callback) callback();
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


UpdateModals.prototype.closeModal = function(modal) {
	// close modal
	modal.classList.add('hidden');
};

window.UpdateModals = new UpdateModals();
window.UpdateModals.init();

})();
