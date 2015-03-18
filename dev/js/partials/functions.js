$(function() {

	// latin letter in input
	$('[data-latin-only]').on('keyup', function(event) {

		$(this).val($(this).val().replace(/[^a-z ]/i, ""));

	});
	// latin letter in input
	$('[data-latin-only]').on('paste', function(event) {
		event.preventDefault();
		// prevent paste
		return false;
	});

	// disabled button
	$('[data-disabled]').on('mousedown', function(event) {

		event.preventDefault();
		return false;

	});


});