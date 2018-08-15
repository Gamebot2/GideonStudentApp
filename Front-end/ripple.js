var buttons = document.getElementsByTagName('button');

setTimeout(function() {	// for some reason, getElementsByTagName takes absolutely forever to load, so this is a manual timeout to wait for all the buttons to come in
	console.log("Number of buttons detected: " + buttons.length);
	for (var b = 0; b < buttons.length; b++) {
		buttons[b].onmousedown = function(e) {
			var button = e.srcElement;
			var rippleContainer = document.createElement('div');
			rippleContainer.setAttribute('id', 'rippleContainer');
			var rippleCircle = document.createElement('span');
			rippleCircle.setAttribute('id', 'rippleCircle');
			rippleCircle.setAttribute('style', 'left:' + e.offsetX + 'px;top:' + e.offsetY + 'px;');
			console.log(rippleCircle);
			rippleContainer.appendChild(rippleCircle);
			button.appendChild(rippleContainer);

			setTimeout(function() {
				button.removeChild(rippleContainer);
			}, 1000);
		}
	}
}, 1000);

