var
net = require('net'),
fs = require('fs');

var server = net.createServer(function (c) {
	fs.readFile('./ticks.log', 'utf8', function (err, data) {
		if (err) throw err;
		
		data = data.split('\n');

		sendTick(0);		

		function sendTick (count) {
			var
			thist = data[count].split('\t'),
			nextt = data[count+1].split('\t'),
			timeout = (nextt[1]-thist[1])*1000;
			
			c.write('\u0001@\tx\tx\t'+thist[0]+'\t'+thist[1]+'\n');
			
			setTimeout(sendTick, timeout, ++count);
		}
	});
});

server.listen(5100);


