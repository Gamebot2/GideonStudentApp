/*
 * RIPPLE
 * A site-wide JS file that creates some cool animations for things. Right now it only contains the ripple effect when you press a button.
 *
 * NOTES:
 * - There is a timeout to allow document items to load. The first thing after that should be console logs, to ensure that the timeout time is OK.
 */


var buttons = document.getElementsByTagName('button');

setTimeout(function() {	// for some reason, getElementsByTagName takes absolutely forever to load, so this is a manual timeout to wait for all the buttons to come in
	console.log("Number of buttons detected: " + buttons.length);

	Array.prototype.forEach.call(buttons, function(b) {
		// ripple event
		b.onmousedown = function(e) {
			var button = e.srcElement;								
																			// CREATES
			var rippleContainer = document.createElement('div');			// <div id = "rippleContainer">
			rippleContainer.setAttribute('id', 'rippleContainer');			// 		<span id = "rippleCircle" style = "left:[x]px; top:[y]px"></span>
			var rippleCircle = document.createElement('span');				// </div>
			rippleCircle.setAttribute('id', 'rippleCircle');
			rippleCircle.setAttribute('style', `left: ${e.offsetX}px; top: ${e.offsetY}px;`);
			rippleContainer.appendChild(rippleCircle);
			button.appendChild(rippleContainer);

			// remove container after a set period
			setTimeout(function() {
				button.removeChild(rippleContainer);
			}, 1000);
		}
	});
}, 1000);

