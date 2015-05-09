/* ==============================

Показ/скрытие сайдбара

================================ */
;(function sidebar() {

	var toggleButton = document.querySelector('[data-sidebar-toggle]'),
		sidebar = document.querySelector('.sidebar'),
		header = document.querySelector('.header'),
		links = document.querySelectorAll('.sidebar_link');

	// because android 4.3 and lower not support
	// classList.toggle

	toggleButton.addEventListener('mousedown', function (event) {

		if ( toggleButton.classList.contains('active') ) {

			toggleButton.classList.remove('active');
			sidebar.classList.remove('active');
			header.classList.remove('active');

		} else {

			toggleButton.classList.add('active');
			sidebar.classList.add('active');
			header.classList.add('active');

		}

	});

	bindListeners(links, 'click', function (event, element) {

		if ( toggleButton.classList.contains('active') ) {

			toggleButton.classList.remove('active');
			sidebar.classList.remove('active');
			header.classList.remove('active');

		} else {

			toggleButton.classList.add('active');
			sidebar.classList.add('active');
			header.classList.add('active');

		}

	});


})();