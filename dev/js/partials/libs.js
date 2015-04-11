/* ============================================

Всякий usefull стаф, вспомогательные функции которые
никак не относятся к приложению, а только упрощают написание кода

1. bindListeners(elements, listener, callback); - Функция которая обходит массив элементов и всем биндит
заданный эвент

2. Element.closest полифил

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