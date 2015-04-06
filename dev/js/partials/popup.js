$(function () {


	var $triggers = $('[data-show-popup]'),
		$popupClose = $('[data-close-popup]');

	$triggers.on('mousedown', function(event) {

		var type = $(this).attr('data-modalType')
		modalShow(type, $(this));

	});

	$popupClose.on('mousedown', function() {
		modalEvent('close');
	});


});

// show modal
// responsible for showing / close modal
function modalEvent(Event) {

	var overlayTransition = 600,
		modalTransition = 600,
		$overlay = $('.overlay'),
		$modal = $('.modal_window');

	if (Event === 'open') {
		openModal();
	}

	if (Event === 'close') {
		closeModal();
	}

	// open modal
	function openModal() {


		$overlay.removeClass('hidden').addClass('active');

		var timeOut = setTimeout(function() {

			$modal.removeClass('hidden').addClass('active');

		}, overlayTransition);
	}

	// close modal
	function closeModal() {

		$modal.removeClass('active');
		$overlay.removeClass('active');

		var timeOut = setTimeout(function () {

			$modal.addClass('hidden');
			$modal.removeClass('gray');
			$overlay.addClass('hidden');

		}, modalTransition);

	}

}


// show modal with text
function modalShow(type, $sender) {

	var $modal = $('.modal_window'),
		$overlay = $('.overlay'),
		modalHeader = '',
		modalDesc = '';



	if (type === 'game') {
		modalEvent('open')
		// showpopup , get question form json
		return;
	}

	else {
		// get text from attr
		modalHeader = $sender.attr('data-modalHeader');
		modalDesc = $sender.attr('data-modalDesc');
		modalEvent('open');

	}

}