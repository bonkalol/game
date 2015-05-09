// /* ==============================

// 	Подгрузка ymetrica ajax'ом

// =============================== */

// ;function loadYM() {

// 	var ymetricaPath = 'assets/ymetrica.html',
// 		response = '';

// 	// если метрика сохранена и онлайн режим
// 	// внедрить в страницу метрику
// 	if ( localStorage.getItem('metrica') && navigator.onLine ) {
// 		response = localStorage.getItem('metrica');
// 		inject();
// 		return;
// 	}

// 	// если офлайн режим
// 	// ничего не делать
// 	if ( !navigator.onLine ) {
// 		return;
// 	}

// 	// если метрика не загружена и онлайн режим
// 	var request = new XMLHttpRequest();
// 	request.open('GET', ymetricaPath, true);

// 	request.onload = function() {

// 		if (request.status >= 200 && request.status < 400) {

// 			response = request.responseText
// 			localStorage.setItem('metrica', response);
// 			inject();

// 		}

// 	};

// 	request.onerror = function() {
// 		// throw error
// 	};

// 	request.send();


// 	// Внедрение метрики в страницу
// 	function inject() {

// 		var body = document.querySelector('head');
// 		console.log(response);
// 		body.insertAdjacentHTML('beforeend', response);

// 	}


// };
