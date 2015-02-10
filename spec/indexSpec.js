var proxyquire = require('proxyquire');

describe('The index module', function() {

	var module;
	var app;
	var fs;

	beforeEach(function() {

		app = {};
		fs = jasmine.createSpyObj('fs', ['existsSync']);

		module = proxyquire('../index', {
			'fs': fs
		});

	});

	it('fails when no express app is set', function() {

		expect(module.setup).toThrow(new Error('Express app not specified'));

	});

	it('fails when no source is set', function() {

		var settings = {
			app: app
		};

		expect(function() {
			module.setup(settings)
		}).toThrow(new Error('No Api source directory found'));

	});

	it('returns when the source directory does not exist', function() {

		var settings = {
			app: app,
			source: './api'
		};

		fs.existsSync.andReturn(false);

		expect(module.setup(settings)).toBe(undefined);
	});

	describe('a configured api', function() {

		var fs;

		beforeEach(function() {

			fs = jasmine.createSpyObj('fs', ['existsSync', 'readdirSync']);

			fs.existsSync.andReturn(true);
			fs.readdirSync.andReturn([]);

			module = proxyquire('../index', {
				'fs': fs
			});
		});

		it('should get the files from the directory', function() {

			

		});

	});
});