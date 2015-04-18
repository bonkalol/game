;(function sidebar() {

	var toggleButton = document.querySelector('[data-sidebar-toggle]'),
		sidebar = document.querySelector('.sidebar'),
		header = document.querySelector('.header');


	toggleButton.addEventListener('mousedown', function(event) {

		toggleButton.classList.toggle('active');
		sidebar.classList.toggle('active');
		header.classList.toggle('active');

	});


})();