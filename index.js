var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(reg, res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
	console.log('listen 3000');
});

var reportsData = require('./reports.json');
let trItems = 0;
let lastTrItems = 0;

io.on('connection', function(socket){
	console.log('new connection');

	socket.on('massage', function(data){
		io.emit('new massage', data);
	});

	// RENDER
	socket.on('pageLoad', function(){
		io.emit('new-connect', reportsData);
	});
	
	// HOVER
	socket.on('profileLinkOnHover', function(data){
		io.emit('profileLinkOnHoverBack', data);
	});

	// SCROLL
	socket.on('bodyOnScroll', function(){
		if (reportsData.tbody.length == lastTrItems) return;
		trItems += 5;
		console.log(trItems, reportsData.tbody.length);
		if (trItems >= reportsData.tbody.length) trItems -= (trItems - reportsData.tbody.length);
		io.emit('profileLinkOnHoverBack', trItems);
		lastTrItems = trItems;
	});
	
});