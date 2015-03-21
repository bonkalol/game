$(function () {


	var $triggers = $('[data-update-json]'),
		json,
		$form = $('#main-form');

	// get json
	$triggers.on('click', function(event) {

		event.preventDefault();

		$.get('assets/response.json', function(data) {

			// json get
			json = data;
			ENV.json = JSON.stringify(json);
			// get first q
			game(data);

		});

	});

});