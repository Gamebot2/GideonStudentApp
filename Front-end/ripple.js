/*
 * RIPPLE
 * A site-wide JS file that creates some cool animations for things. Right now it only contains the ripple effect when you press a button.
 *
 * NOTES:
 * - This script will be obsolate if and when we figure out how to fix the CSS of AngularJS Material's ink ripples
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