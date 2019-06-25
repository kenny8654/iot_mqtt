var serverApp = require('./app.js');
var http = require('http');
var mosca = require('mosca');
var fs = require('fs');
var port = 8080;

http.createServer(serverApp).listen(port);
console.log("Express sever is now listening on port : " + port);

var pubsubsettings = {
	type: 'mqtt',
	json: false,
	mqtt: require('mqtt'),
	host: '140.116.72.90',
	port: 1883
};

var server = new mosca.Server(pubsubsettings);	//here we start mosca
server.on('ready', setup);	//on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
	console.log('Mosca server is up and running on host : ' + pubsubsettings.host + ' port : ' + pubsubsettings.port)
}

// fired when a message is published
server.on('published', function (packet, client) {
	try {  
	//	console.log('packet : '+JSON.stringify(packet))
		var json_source = JSON.parse(packet.payload.toString('UTF-8'))
		//var json_source = JSON.parse(packet.payload.toString('UTF-8'));
		//var action = json_source.action;
		if (packet.topic === 'postHT'){
			console.log("json_source : "+JSON.stringify(json_source))
			var DeviceID = json_source.DeviceID;
                        var Humidity = json_source.Humidity;
			var Temperature = json_source.Temperature;
                        var time = new Date().getTime();
                        var data = `${time},${Humidity},${Temperature}\n`
			console.log("data : "+data)
			fs.appendFile("public/data/"+DeviceID+".txt", data, (err)=>{
				//console.log(err)
		})
			var json_target = JSON.stringify(
				{
					action: action,
					source: packet.topic,
					name: name,
					profilePicture: profilePicture,
					UUID: UUID
				}
			);
			//var message = {
			//	topic: target,
			//	payload: json_target,
			//	qos: 2,
			//	retain: true
			//};
			//server.publish(message, function () {
			//	console.log("=============redirect==============")
			//	console.log('Done!\n', message);
			//	console.log("===================================")
			//});
		} 
	} catch (e) {
		// console.log(e);
	}
});
// fired when a client connects
server.on('clientConnected', function (client) {
	console.log('Client Connected:', client.id);
});
// fired when a client disconnects
server.on('clientDisconnected', function (client) {
	console.log('Client Disconnected:', client.id);
});
