$(function () {


	var $triggers = $('[data-update-json]'),
		$form = $('#main-form');

	// get json
	$triggers.on('click', function(event) {

		event.preventDefault();

		preloaderShow();

		$.get('assets/response.json', function(data) {

			localStorage.setItem('json', JSON.stringify(data));
			// get first q
			game(data);


		}).done(function() {

			preloaderHide();

		}).fail(function() {

			console.log('fail');

		});

	});

});