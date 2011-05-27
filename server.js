var
http = require("http"),
net = require('net'),
url = require("url"),
path = require("path"),
sys = require('sys'),
fs = require('fs'),
bind = require('bind'),
sio = require('socket.io');

var server = http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;

	// Static files
	if(/\/static\//i.test(uri) || uri == '/favicon.ico')
	{
		var filename = path.join(process.cwd(), uri);

		path.exists(filename, function(exists) {
			if(!exists) {
				res.writeHead(404);
				res.end();
				return;
			}
			
			fs.readFile(filename, "binary", function(err, file) {
				if(err) {
					res.writeHead(500, {"Content-Type": "text/plain"});
					res.end(err + "\n");
				}

				res.writeHead(200);
				res.end(file, "binary");
			});
		});
	} else {
		// URI routes
		switch(uri) {
		case '/':
			renderHtml(res, 'index.html');
			break;
		case '/race':
			renderHtml(res, 'race.html');
			break;
		}
	}
});

server.listen(8080);

var socket = sio.listen(server);

socket.on('connection', function (sclient) {

	// Object holding previous ticks
	var
	ptck = {},
	laps = 0;

	client.addListener("data", function(data) {
		data = data.replace('\u0001', '');
		data = data.split('\t')

		var
		delta = 0,
		trsp = data[3],
		tick = data[4];
		
		if (data[0] == '@') {
			console.log('Transponder: '+trsp);
	
			var lap = 0;

			if (ptck[trsp]) {
				delta = tick - ptck[trsp];
				
				// Send transp, tick and delta to web client
				sclient.send({
					trsp: trsp,
					tick: tick,
					delta: delta,
				});

				console.log('Tick: '+tick);
				console.log('Time: '+delta+'s');
			}

			ptck[trsp] = tick;
		}
		
		if (data == "close")
			client.end();
	});	

	
	sclient.on('message', function () {
		console.log('client: message');
	});
	
	sclient.on('disconnect', function () {
		console.log('client: disconnect');
	});

}); 

//
// Connect to AMB Box
//
var client = net.createConnection(5100, '192.168.0.240');

client.setEncoding("UTF8");

client.addListener("connect", function() {
	// start server
	sys.puts("Connected to AMB box.");
});

client.addListener("close", function(data) {
	sys.puts("Disconnected from AMB box.");
});

function renderHtml(res, file, data, header) {
	var header = header || {'Content-Type': 'text/html'};

 	bind.toFile('./templates/'+file, data, function callback(data) {
		res.writeHead(200, header);
		res.end(data);
	});
}
