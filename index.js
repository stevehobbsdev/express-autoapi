var fs = require('fs');
var path = require('path');
var _ = require('underscore')._;
var utils = require('./util.js');

var defaults = {
    root: '/api',
    debug: false
};

var currentsettings = null;

function __log(args) {
	if(currentsettings.debug) {
		console.log(arguments);
	}
}

module.exports = {

    setup: function(settings) {

    	settings = currentsettings = _.extend({}, defaults, settings || {});

    	if(!settings.app)
    		throw "Express app not specified";

    	__log("Settings: ", settings);

        if (!settings.source || typeof settings.source != 'string')
            throw "No Api source directory found";

        if (!fs.existsSync(settings.source))
            return;

        var state = {
            endpoints: {},
            settings: settings
        };

        var files = fs.readdirSync(settings.source);

        for (var i = 0; i < files.length; i++) {

            var modulePath = path.join(settings.source, files[i]);

            // Try to load the module
            var module = require(modulePath);
            var name = path.basename(modulePath, ".js").replace(/\./g, '_');
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
}
