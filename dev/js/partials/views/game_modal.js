/* =====================================

Показ модального окна
1. Открытие модального окна, данные content @ type берутся из функции getTruthOrAction(type);
2. Закрытие модального окна, проверка стриков

====================================== */
// 1.
;function showModal(content) {

	var modal = document.querySelector('[data-game-modal]'),
		nextQA = document.querySelector('[data-game-modal-next]');

	nextQA.removeAttribute('data-disabled');

	var modalText = modal.querySelector('[data-game-modal-content]');
	modalText.innerHTML = content.text;


	var timeout = function () {

		modal.classList.remove('hidden');
		modal.classList.add('active');

	};


	Overlay.show(timeout);

	if (content.class && content.class.length >= 1) {
		modal.classList.add(content.class);
	}


};

// 2.
;function closeModal() {

	var modal = document.querySelector('[data-game-modal]'),
		truthButton = document.querySelector('[data-showmodal-button="truth"]'),
		actionsButton = document.querySelector('[data-showmodal-button="actions"]');

	modal.classList.remove('active');
	var hideModal = function () {
		modal.classList.add('hidden');
	}
	Overlay.hide(hideModal);

	// next player
	nextPlayer();
	var status = getCheckedStreak();

	// disable/enable buttons
	if (status.truth === false) {
		truthButton.classList.add('disabled');
		truthButton.setAttribute('data-disabled', 'true');
	} else {
		truthButton.classList.remove('disabled');
		truthButton.removeAttribute('data-disabled');
	}


	// disable/enable buttons
	if (status.actions === false) {
		actionsButton.classList.add('disabled');
		actionsButton.setAttribute('data-disabled', 'true');
	} else {
		actionsButton.classList.remove('disabled');
		actionsButton.removeAttribute('data-disabled');
	}


};