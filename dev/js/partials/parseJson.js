$(function () {


	var $triggers = $('[data-update-json]'),
		json,
		$form = $('#main-form');

	// get json
	$triggers.on('click', function(event) {

		event.preventDefault();

		preloaderShow();

		$.get('assets/response.json', function(data) {

			// json get
			json = data;
			localStorage.setItem('json', JSON.stringify(json));
			// get first q
			game(data);


		}).done(function() {

			preloaderHide();

		}).fail(function() {

			console.log('fail');

		});

	});

});