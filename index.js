var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var app = express();

module.exports = function(app, apiPath) {

	if(!router)
		throw "No express app";

	apiPath = apiPath || app.get('api source');

	if(!apiPath || typeof apiPath !== 'string') {
		throw new "No api path specified";
	}		

	if(!fs.existsSync(apiPath))
		return;

	var files = fs.readdirSync(apiPath);
	console.log(files);

	for(var i = 0; i < files.length; i++) {

		var modulePath = path.join(apiPath, files[i]);

		console.log("Loading " + modulePath);

		// Try to load the module
		var module = require(modulePath);

		var name = path.basename(modulePath, ".js").replace(/\./g, '_');

		// Get it to apply it's routes
		app.use('/api/' + name, module);
	}
	
};