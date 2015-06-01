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
    if (debugMode) {
        console.log.apply(null, arguments);
    }
}

/**
 * Processes a list of files and produces the api routing for them
 * @param files The list of files to process
 * @param settings express-autoapi settings
 * @param state The process state
 */
function processFileList(files, base, settings, state) {

    for (var i = 0; i < files.length; i++) {

        var modulePath = path.join(base, files[i]);

        var stats = fs.statSync(modulePath);

        if (stats.isFile()) {

            // Try to load the module
            var module = require(modulePath);            
            var relative = path.relative(settings.source, modulePath);

            __log('Relative path: %s', relative);

            var baseName = path.basename(relative, ".js");
            var name = relative.substr(0, relative.lastIndexOf('.')).replace(/\./g, '_');

            // Special case for an index file - put these in the root of the api
            if (baseName === settings.rootModule) {

                if(name.lastIndexOf('/') > -1)
                    name = name.substr(0, name.lastIndexOf('/'));
                else
                    name = undefined;
            }

            __log('%s (%s)', baseName, name);

            var apiPath = utils.combineApiPath(settings.root, name);

            state.endpoints[name] = {
                baseUrl: apiPath,
                filename: modulePath,
                baseName: name
            };

            __log(state.endpoints[name]);

            settings.app.use(apiPath, module);
        }
        else if (stats.isDirectory()) {
            var dirFiles = fs.readdirSync(modulePath);
            processFileList(dirFiles, modulePath, settings, state);
        }
    }
}

module.exports = {

    setup: function(settings) {

        settings = _.extend({}, defaults, settings || {});
        debugMode = settings.debug;

        if (!settings.app)
            throw "Express app not specified";

<<<<<<< HEAD
        __log("Settings: ", settings);
=======
        var loggedSettings = _.extend({}, settings);
        delete loggedSettings.app;
    	__log("Settings: ", loggedSettings);
>>>>>>> origin/master

        if (!settings.source || typeof settings.source != 'string')
            throw "No Api source directory found";

        if (!fs.existsSync(settings.source))
            return;

        var state = {
            endpoints: {},
            settings: settings
        };

        var files = fs.readdirSync(settings.source);

<<<<<<< HEAD
        processFileList(files, settings.source, settings, state);
=======
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
>>>>>>> origin/master

        return state;
    }
};
