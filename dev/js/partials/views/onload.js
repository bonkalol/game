window.onload = function(event) {

	preloader('hide');

	// save default game start for reset to default state
	var saveDefaultGameStart;

	saveDefaultGameStart = document.querySelector('[data-gamestart]').innerHTML;

	localStorage.setItem('gamestartHTML', saveDefaultGameStart);

	// preload json if game was not started
	if ( !localStorage.getItem('info') && navigator.onLine )
		getJson();

	loadYM();

};