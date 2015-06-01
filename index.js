var fs = require('fs');
var path = require('path');
var _ = require('underscore')._;
var utils = require('./util.js');
var chalk = require('chalk');

var defaults = {
    root: '/api',
    debug: false,
    rootModule: 'index'
};

var debugMode = false;

function __log(args) {
	if(debugMode) {
		console.log(arguments);
	}
}

module.exports = {

     setup: function(settings) {

    	settings = _.extend({}, defaults, settings || {});
        debugMode = settings.debug;

    	if(!settings.app)
    		throw "Express app not specified";

        var loggedSettings = _.extend({}, settings);
        delete loggedSettings.app;
    	__log("Settings: ", loggedSettings);

        if (!settings.source || typeof settings.source != 'string')
            throw "No Api source directory found";

        if (!fs.existsSync(settings.source))
            return;

        var state = {
            endpoints: {},
            settings: settings
        };

        var files = fs.readdirSync(settings.source);

        if(settings.debug) {
            console.log(chalk.green('Files:'));
            console.log(files);
            console.log();
        }

        for (var i = 0; i < files.length; i++) {

            var modulePath = path.join(settings.source, files[i]);
            
            // Try to load the module
            var module = require(modulePath);
            var name = path.basename(modulePath, ".js").replace(/\./g, '_');

            if(settings.debug)
                console.log(chalk.green('Found module: ') + name);

            // Special case for an index file - put these in the root of the api
            if(name === settings.rootModule) {
                name = undefined;
            }

			var apiPath = utils.combineApiPath(settings.root, name);

			state.endpoints[name] = {
				baseUrl: apiPath,
				filename: modulePath,
				baseName: name
			};

			__log(state.endpoints[name]);

            settings.app.use(apiPath, module);
        }

        return state;
    }
};
