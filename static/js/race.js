$(document).ready(function() {
	var
	socket = new io.Socket(),
	stats = { best: 9999 }

	socket.connect();

	socket.on('connect', function(obj) {
	});
	
	socket.on('message', function(obj) {
		var trsp = urlParams.trsp; //$.deparam.querystring(true).trsp,
		
		if (trsp == obj.trsp) {
			var delta = Math.round(obj.delta*1000)/1000;
			
			$('h1').html(delta);

			if (delta < stats.best) {
				stats.best = delta;
				$('h2').html(delta);
			}
		}
	});
	
	socket.on('disconnect', function() {

	});

	// Get querystring values
	// http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript
	//
	var urlParams = {};
	(function () {
		var e,
		a = /\+/g,  // Regex for replacing addition symbol with a space
		r = /([^&=]+)=?([^&]*)/g,
		d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
		q = window.location.search.substring(1);
		
		while (e = r.exec(q))
			urlParams[d(e[1])] = d(e[2]);
	})();
});
