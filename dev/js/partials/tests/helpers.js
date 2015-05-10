/* ==========================================

1. element.trigger

============================================ */

// 1
;function triggerEvent(eventName, target) {

	target.addEventListener('eventName', function (event) {

		console.log('trigger');

	});

	// Create the event
	var triggerEvent = new CustomEvent(eventName, { "detail": "Example of an event" });

	// Dispatch/Trigger/Fire the event
	target.dispatchEvent(triggerEvent);


};