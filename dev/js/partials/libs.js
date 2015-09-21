/* ============================================

Всякий usefull стаф, вспомогательные функции которые
никак не относятся к приложению, а только упрощают написание кода

1. bindListeners(elements, listener, callback); - Функция которая обходит массив элементов и всем биндит
заданный эвент

2. Element.closest полифил

2.1. Element.remove полифил

3. Random функция

4. Поддерживает ли браузер localStorage

============================================ */


// 1.
function bindListeners(elements, listener, callback) {


	[].forEach.call(elements, function (element, index, array) {

		element.addEventListener(listener, function (event) {

			callback(event, element);

		});

	});
}


// 2.
(function (ELEMENT, PREFIX) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT[PREFIX + 'MatchesSelector'];

	ELEMENT.closest = ELEMENT.closest || function (selector) {
		var node = this;

		while (node) {
			if (node.matches(selector)) return node;
			else node = node.parentElement;
		}

		return null;
	};
})(
	Element.prototype,
	(this.getComputedStyle && [].join.call(getComputedStyle(document.documentElement, '')).match(/-(moz|ms|webkit)-/) || [])[1]
);

// 2.1.

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = 0, len = this.length; i < len; i++) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}


// 3.
function getRandomInt(min, max) {

	return Math.floor(Math.random()*(max + 1 - min)) + min;

}


// 4.
function localStorageTest() {

	var test = 'test';

	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}

}


Number.prototype.toArrayLength = function() {
	return this.valueOf() + 1;
};