/* =====================================

Показ модального окна
1. Открытие модального окна, данные content @ type берутся из функции getTruthOrAction(type);
2. Закрытие модального окна, проверка стриков

====================================== */

// 1.
;function showModal(content, type) {

	var overlay = document.querySelector('[data-game-overlay]'),
		modal = document.querySelector('[data-game-modal]');

	var modalText = modal.querySelector('[data-game-modal-content]');
	modalText.innerHTML = content;

	overlay.classList.remove('hidden');
	overlay.classList.add('active');

	var timeout = setTimeout(function () {

		modal.classList.remove('hidden');
		modal.classList.add('active');

	}, 600);


};

// 2.
;function closeModal() {

	var overlay = document.querySelector('[data-game-overlay]'),
		modal = document.querySelector('[data-game-modal]'),
		truthButton = document.querySelector('[data-truth-button'),
		actionsButton = document.querySelector('[data-action-button]');

	modal.classList.remove('active');
	overlay.classList.remove('active');

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

	var timeOut = setTimeout(function () {

		modal.classList.add('hidden');
		modal.classList.remove('gray', 'mass');
		overlay.classList.add('hidden');


	}, 600);


};