

;(function () {

	var Overlay = function () {
		this.self = document.querySelector('[data-game-overlay]');
		this.states = ['hidden', 'active'];
		this.timeout = 600;
		this.listener = false;
	};



	Overlay.prototype.show = function(callback, close) {
		this.self.classList.remove(this.states[0]);
		this.self.classList.add(this.states[1]);
		var timeout = null,
		overlay = this;
		if (close && typeof close === 'function') {
			this.self.addEventListener('mousedown', function (event) {
				overlay.hide(null, arguments);
				overlay.listener = true;
				close();
			}, false);
		}
		if (!callback || callback === null) return;
		else { timeout = setTimeout(function() { callback(); }, overlay.timeout); }
	};



	Overlay.prototype.hide = function(callback, args) {
		var overlay = this,
		timeout = null;

		this.self.classList.remove(this.states[1]);
		timeout = setTimeout(function () {
			overlay.self.classList.add(overlay.states[0]);
			if (overlay.listener === true) { overlay.self.removeEventListener('mousedown', args.callee, false); overlay.listener = false; }
			if (callback && callback !== null) { callback(); }
		}, overlay.timeout);
	};

	window.Overlay = new Overlay();

})();