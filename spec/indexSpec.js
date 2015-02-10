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

    describe('when configured', function() {

        var fs;
        var app;
        var settings;
        var module;
        var result;
        var testModuleStub;

        beforeEach(function() {

            fs = jasmine.createSpyObj('fs', ['existsSync', 'readdirSync']);

            fs.existsSync.andReturn(true);
            fs.readdirSync.andReturn(['testModule.js']);

            testModuleStub = {
                '@noCallThru': true // prevent this fictional module from being loaded
            };

            module = proxyquire('../index', {
                'fs': fs,
                'api/testModule.js': testModuleStub
            });

            app = jasmine.createSpyObj('app', ['use']);

            settings = {
                app: app,
                source: './api',
                root: '/apiroot'
            };

            result = module.setup(settings);
        });

        it('should add the correct endpoint to the express app', function() {

            expect(app.use).toHaveBeenCalledWith('/apiroot/testModule', testModuleStub);

        });

        it('should check for existance of the module file using settings', function() {

            expect(fs.existsSync).toHaveBeenCalledWith(settings.source);

        });

        it('should read the module file using settings', function() {

            expect(fs.readdirSync).toHaveBeenCalledWith(settings.source);

        });

        it('should return the module', function() {

            expect(result.endpoints.testModule).toBeDefined();

        });

        it('should have the correct base url', function() {

            expect(result.endpoints.testModule.baseUrl).toBe('/apiroot/testModule');

        });

        it('should have the correct module path', function() {

            expect(result.endpoints.testModule.filename).toBe('api/testModule.js');

        });

        it('should have the correct module name', function() {
            expect(result.endpoints.testModule.baseName).toBe('testModule');
        });

    });
});
