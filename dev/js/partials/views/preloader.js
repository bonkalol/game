

;function preloader(method) {


	var preloaderConfigs = {
		selector: document.querySelector('.preloader'),
		visiblityClass: 'visibility',
		opacityClass: 'opacity',
		transitionTime: 600
	}

	switch(method) {
		case 'hide': {

			preloaderConfigs.selector.classList.add(preloaderConfigs.opacityClass);

			var timeout = setTimeout(function() {

				preloaderConfigs.selector.classList.add(preloaderConfigs.visiblityClass);

			}, preloaderConfigs.transitionTime);

		};
		break;

		case 'show': {

			preloaderConfigs.selector.classList.remove(preloaderConfigs.visiblityClass);
			preloaderConfigs.selector.classList.remove(preloaderConfigs.opacityClass);

		}
		break;

		case 'getState': {

			if ( preloaderConfigs.selector.classList.contains(preloaderConfigs.visiblityClass) ) {
				return 'hidden';
			}

			else {
				return 'visible';
			}

		}
		break;
	}

};