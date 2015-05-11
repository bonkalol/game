/* ========================================

Тест инициализации игры

======================================== */

;function gameInitTest() {

	var rulesModal = document.querySelector('[data-rules-modal]'),
		rulesNextButton = rulesModal.querySelector('[data-gamestart-nextmodal]');

	triggerEvent('mousedown', rulesNextButton);

};