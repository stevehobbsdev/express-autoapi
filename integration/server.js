var path = require('path');
var express = require('express');
var app = express();

var api = require('../index');

api.setup({
	app: app,
	source: path.join(__dirname, 'api'),
	debug: true
});

app.get('/', function(req, res) {
	res.send('express-autoapi integration test server');
});

var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Integration server started http://%s:%s', host, port);
})