var preloader = {
	selector: $('.preloader'),
	visiblityClass: 'visibility',
	opacityClass: 'opacity',
	transitionTime: 600
}

function preloaderShow() {

	preloader.selector.removeClass(preloader.visiblityClass);
	preloader.selector.removeClass(preloader.opacityClass);

}


function preloaderHide() {


		preloader.selector.addClass(preloader.opacityClass);

		var timeout = setTimeout(function() {

			preloader.selector.addClass(preloader.visiblityClass);

		}, preloader.transitionTime);

}