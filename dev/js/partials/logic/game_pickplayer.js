

(function () {

	var Playerlist = function () {
		this.self = document.querySelector('[data-player-list]');
		this.classes = ['visible', 'opacity'];
		this.transition = 600;
		this.active = 'checked';
		this.selector = 'data-player-list-select';
		this.container = document.querySelector('[data-player-list-container]');
	};

	Playerlist.prototype.show = function(callback) {
		var timeout = null,
		Playerlist = this;
		this.self.classList.add(this.classes[0]);
		this.self.classList.add(this.classes[1]);
		if (callback) {
			timeout = setTimeout(function() {
				Playerlist.clean();
				callback.call(this);
			}, Playerlist.transition);
		}
	};

	Playerlist.prototype.hide = function(callback) {
		var timeout = null,
		Playerlist = this;
		this.self.classList.remove(this.classes[1]);
		timeout = setTimeout(function() {
			Playerlist.self.classList.add(Playerlist.classes[0]);
			if (callback) callback.call(Playerlist);
		}, Playerlist.transition);
	};

	Playerlist.prototype.init = function() {
		var Playerlist = this,
		nodes = [];
		document.addEventListener('mousedown', function (event) {
			if (event.target.closest('[' + Playerlist.selector + ']') &&
				event.target.closest('[' + Playerlist.selector + ']').hasAttribute(Playerlist.selector)) {
					var target = event.target.closest('[' + Playerlist.selector + ']');
					Playerlist.clean();
					target.classList.add(Playerlist.active);
					Playerlist.checkReadiness();
			}
		}, false);
		document.addEventListener('mousedown', function (event) {
			if (event.target.hasAttribute('data-player-list-done') ||
				event.target.parentNode.hasAttribute('data-player-list-done')) {
				Overlay.hide();
				Playerlist.hide(Playerlist.clean);
			}
		}, false);
	};

	Playerlist.prototype.clean = function() {
		var players = document.querySelectorAll('[' + this.selector + ']'),
		Playerlist = this;
		[].forEach.call(players, function (player) {
			player.classList.remove(Playerlist.active);
		});
	};

	Playerlist.prototype.render = function() {
		var template = '';
		GAME.players.forEach(function (player) {
			template += TEMPLATES.gamePickPlayer(player.gender, player.name);
		});
		this.container.innerHTML = template;
	};

	Playerlist.prototype.checkReadiness = function() {
		var Playerlist = this,
		button = document.querySelector('[data-player-list-done]'),
		nodes = document.querySelectorAll('[' + this.selector + ']'),
		checked = [].some.call(nodes, function (node) {
			return node.classList.contains(Playerlist.active);
		});
		if (checked === true) {
			button.removeAttribute('data-disabled');
		} else {
			button.setAttribute('data-disabled', null);
		}
	};

	window.Playerlist = new Playerlist();
	window.Playerlist.init();

})();