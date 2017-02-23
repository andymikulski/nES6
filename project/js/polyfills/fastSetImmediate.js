


// From: http://dbaron.org/log/20100309-faster-timeouts

// Only add setZeroTimeout to the window object, and hide everything
// else in a closure.
var timeout = null;
var messageName = "fi";

// Like setTimeout, but only takes a function argument.  There's
// no time argument (always zero) and no arguments (you have to
// use a closure).
export function setFastTimeout(fn) {
	timeout = fn;
};

export function invokeFastTimeout() {
	window.postMessage(messageName, "*");
};

function handleMessage(event) {
	if ( event.data === messageName ) {
		event.stopPropagation();
		timeout();
	}
}

window.addEventListener( "message", handleMessage, false, false );

// Add the one thing we want added to the window object.
window.setFastTimeout = setFastTimeout;
window.invokeFastTimeout = invokeFastTimeout;
