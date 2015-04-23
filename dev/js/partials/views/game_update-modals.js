/* ===================================

Обновление модальных окон после того, как игра была начата


===================================== */

;function updateModals() {

	var playersModal = document.querySelector('[data-newPlayer-modal]'),
		rubricModal = document.querySelector('[data-rubricSelect-modal]'),
		rulesModal = document.querySelector('[data-rules-modal]');


	// remove back button
	[].forEach.call(document.querySelectorAll('[data-gamestart-modal]'), function (element, index, array) {

		if ( element.querySelector('[data-gamestart-prevmodal]') ) {

			element.querySelector('[data-gamestart-prevmodal]').remove();

			if ( element.querySelector('[data-gamestart-nextmodal]') ) {
				element.querySelector('[data-gamestart-nextmodal]').classList.remove('next-back');
			}

		}

		if ( element.querySelector('[data-gamestart-nextmodal]') ) {
			element.querySelector('[data-gamestart-nextmodal]').innerHTML = 'Ок';
		}

	});

	// remove attr which trigger nextButton
	[].forEach.call(document.querySelectorAll('[data-gamestart-nextmodal]'), function (element, index, array) {

		element.removeAttribute('data-gamestart-nextmodal');
		element.setAttribute('data-close-default-modal', '');

	});

	bindListeners(document.querySelectorAll('[data-close-default-modal]'), 'mousedown', function (event, element) {

		if ( element.getAttribute('data-newplayer-modal-button') !== null &&
			 element.getAttribute('data-newplayer-modal-button') !== undefined) {
			updateMainPlayersCloud();
			saveGameState();
		}

		if ( element.getAttribute('data-rubricselect-modal-button') !== null &&
			 element.getAttribute('data-rubricselect-modal-button') !== undefined) {
			updateAllTruthActions();
			saveGameState();
		}

		// close modals
		element.closest('[data-gamestart-modal]').classList.add('hidden');

		var gameStartWrap = document.querySelector('[data-gamestart]'),
			timeout = null;

		gameStartWrap.classList.add('hidden');

		timeout = setTimeout(function() {

			gameStartWrap.classList.add('visibility');

		}, 600);

	});

	bindListeners(document.querySelectorAll('[data-show-default-modal]'), 'click', function (event, element) {

		event.preventDefault();

		// open modals
		var targetModalName = element.getAttribute('data-show-default-modal'),
			targetModal = document.querySelector('[' + targetModalName + ']'),
			gameStartWrap = document.querySelector('[data-gamestart]'),
			timeout = null;

		gameStartWrap.classList.remove('visibility');
		gameStartWrap.classList.remove('hidden');

		timeout = setTimeout(function() {

			targetModal.classList.remove('hidden');
			targetModal.classList.add('active');

		}, 100);

	});

};