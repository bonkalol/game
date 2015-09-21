/* ==============================

Показ/скрытие сайдбара

================================ */
;(function sidebar() {

	var toggleButton = document.querySelector('[data-sidebar-toggle]'),
		sidebar = document.querySelector('.sidebar'),
		header = document.querySelector('.header'),
		links = document.querySelectorAll('.sidebar_link'),
		body = document.querySelector('body');

	// because android 4.3 and lower not support
	// classList.toggle
	var sidebarClose = function () {
		toggleButton.classList.remove('active');
		sidebar.classList.remove('active');
		header.classList.remove('active');
		body.classList.remove('sidebared');
	};

	var sidebarOpen = function () {
		toggleButton.classList.add('active');
		sidebar.classList.add('active');
		header.classList.add('active');
		body.classList.add('sidebared');
	};

	toggleButton.addEventListener('mousedown', function (event) {

		if ( toggleButton.classList.contains('active') ) {

			sidebarClose();
			Overlay.hide();

		} else {

			sidebarOpen();
			Overlay.show(null, sidebarClose);

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