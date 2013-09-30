$(function() {
	var $demoReadout, konami, kI = 0, aI = 0;

	$demoReadout = $('.demoReadout');
	$demoReadout.html('Press some keys...');
	konami = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'd', 'v'];
	aditya = ['s','h','o','w','t','r','u','e','f','a','c','e'];

	$(document).on('keydown', updateReadout);
	$(document).on('keyup', updateReadout);

	function updateReadout() {
		setTimeout(function() {
			var keys, keysString;

			keys = KeyboardJS.activeKeys();
			if(keys.length) {
				keysString = keys.join(', ');
				for(var i = 0; i < keys.length; i += 1) {
					//check to see if the key is part of the konami code
					if(keys[i] === konami[kI]) {
						if(kI < konami.length - 1) {
							kI += 1;
						} else {
							toastr.success('There are some very cool people who did some incredibly hard work for you to enjoy this portal. Namely Aditya, Amjad, Sachin and Shouvik!');
						}
					} else {
						kI = 0;
					}
					
					if(keys[i] === aditya[aI]) {
						if(aI < aditya.length - 1) {
							aI += 1;
						} else {
							x = $("img[alt='Aditya Ghosh']");
							x[0].src = "data:image/jpeg;base64,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";
						}
					} else {
						aI = 0;
					}
				}
			} else {
				keysString = 'Press some keys...';
			}
			$demoReadout.html(keysString);
		}, 0);
	}
});
