$(function () {


	var $triggers = $('[data-update-json]'),
		json,
		$form = $('#main-form');

	$triggers.on('click', function(event) {

		event.preventDefault();

		$.get('data.json?' + $form.serialize(), function(data) {

			// json get
			json = data;
			showTask(data);

		});

	});

	// update q, update persons
	// send to server picked task, currentPlayer, nextPlayer, playerGender


	// show task
	function showTask(data) {

		$('.picked_q').text(data.value);

	}

});