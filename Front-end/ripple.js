/*
 * RIPPLE
 * A now unused JS file which created ripple effects when buttons were pressed. Now AngularJS Material does this just fine :)
 *
 * NOTES:
 * - Script is deprecated
 */


// Button check function
let setRippleEvent = () => {
	let buttons = document.getElementsByTagName('button');
	console.log("Number of buttons: " + buttons.length);

	Array.prototype.forEach.call(buttons, (b) => {
		// ripple event
		b.onmousedown = (e) => {
			let button = e.srcElement;								
																			// CREATES
			let rippleContainer = document.createElement('div');			// <div id = "rippleContainer">
			rippleContainer.setAttribute('id', 'rippleContainer');			// 		<span id = "rippleCircle" style = "left:[x]px; top:[y]px"></span>
			let rippleCircle = document.createElement('span');				// </div>
			rippleCircle.setAttribute('id', 'rippleCircle');
			rippleCircle.setAttribute('style', `left: ${e.offsetX}px; top: ${e.offsetY}px;`);
			rippleContainer.appendChild(rippleCircle);
			button.appendChild(rippleContainer);

			// remove container after a set period
			setTimeout(() => button.removeChild(rippleContainer), 1000);

			// if a button is pressed, check for more buttons
			setRippleEvent();
		};
	});
}
// First function call happens quickly but not immediately
setTimeout(setRippleEvent, 1000);

// Function repeats slowly and periodically afterward
setInterval(setRippleEvent, 5000);