var proxyquire = require('proxyquire');
var path = require('path');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('The index module', function() {

    var module;
    var app;
    var fs;

    beforeEach(function() {

        app = {};
        fs = {
            existsSync: sinon.stub()
        };

        module = proxyquire('../index', {
            'fs': fs
        });

    });

    it('fails when no express app is set', function() {

        expect(module.setup).to.throw('Express app not specified');

    });

    it('fails when no source is set', function() {

        var settings = {
            app: app
        };

        expect(function() {
            module.setup(settings)
        }).to.throw('No Api source directory found');

    });

    it('returns when the source directory does not exist', function() {

        var settings = {
            app: app,
            source: './api'
        };

        fs.existsSync.returns(false);

        expect(module.setup(settings)).to.be.undefined;
    });

    describe('when configured', function() {

        var fs;
        var app;
        var settings;
        var module;
        var result;
        var testModuleStub;
        var testFile = 'index.js';

        beforeEach(function() {

            fs = {
                existsSync: sinon.stub().returns(true),
                readdirSync: sinon.stub().returns([testFile])
            };

            testModuleStub = {
                '@noCallThru': true // prevent this fictional module from being loaded
            };

            app = {
                use: sinon.stub()
            };

            settings = {
                app: app,
                source: path.join(__dirname, 'testApi'),
                root: '/apiroot'
            };

            var modulePath = path.join(settings.source, testFile);

            var stubs = {
            	'fs': fs
            };

            stubs[modulePath] = testModuleStub;

            module = proxyquire('../index', stubs);

            result = module.setup(settings);
        });

        it('should add the correct endpoint to the express app', function() {

            app.use.calledWith('/apiroot', testModuleStub);

        });

        it('should check for existance of the module file using settings', function() {

            fs.existsSync.calledWith(settings.source);

        });

        it('should read the module file using settings', function() {

            fs.readdirSync.calledWith(settings.source);

        });

        it('should return the module', function() {

            console.log('Endpoints', result.endpoints);
            expect(result.endpoints.index).to.exist;

        });

        it('should have the correct base url', function() {

            expect(result.endpoints.index.baseUrl).to.equal('/apiroot');

        });

        it('should have the correct module path', function() {

        	var expected = path.join(settings.source, testFile);

            expect(result.endpoints.index.filename).to.equal(expected);

        });

        it('should have the correct module name', function() {
            expect(result.endpoints.index.baseName).to.equal('index');
        });

    });
});
