window.onload = function(event) {

	preloader('hide');

	// save default game start for reset to default state
	var saveDefaultGameStart;

	saveDefaultGameStart = document.querySelector('[data-gamestart]').innerHTML;

	localStorage.setItem('gamestartHTML', saveDefaultGameStart);

};