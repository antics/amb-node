$(document).ready(function() {
	var
	socket = new io.Socket(),
	trsp = $.deparam.querystring(true).trsp,
	stats = { best: 9999 }

	socket.connect();

	socket.on('connect', function(obj) {
	});
	
	socket.on('message', function(obj) {

		if (trsp == obj.trsp) {
			var delta = Math.round(obj.delta*1000)/1000
			$('h1').html(delta);

			if (delta < stats.best) {
				stats.best = delta;
				$('h2').html(delta);
			}
		}
	});
	
	socket.on('disconnect', function() {

	});
});
