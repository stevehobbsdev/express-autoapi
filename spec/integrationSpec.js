var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var api = require('../index');
var path = require('path');

describe('The test integration api', function() {

	var app;
	var r;
	var routeData;
	var endpoints;
	var routeKeys = ['baseUrl', 'filename', 'routeName'];

	before(function() {
		
		app = express();

		routeData = api.setup({
			app: app,
			source: path.join(__dirname, 'testApi')
		});

		endpoints = routeData.endpoints;

		r = request(app);

	});

	describe('the endpoint data', function() {

		it('should generate a route for /api', function() {
			expect(endpoints.index).to.exist;
			expect(endpoints.index).to.have.all.keys(routeKeys);
			expect(endpoints.index.baseUrl).to.equal('/api');
			expect(endpoints.index.filename).to.match(/\\testApi\\index\.js$/);
			expect(endpoints.index.routeName).to.equal('index');
		});

		it('should generate a route for /api/user', function() {
			expect(endpoints.user).to.exist;
			expect(endpoints.user).to.have.all.keys(routeKeys);
			expect(endpoints.user.baseUrl).to.equal('/api/user');
			expect(endpoints.user.filename).to.match(/\\testApi\\user\.js$/);
			expect(endpoints.user.routeName).to.equal('user');
		});

		it('should generate a route for /api/sub', function() {
			expect(endpoints['sub/index']).to.exist;
			expect(endpoints['sub/index']).to.have.all.keys(routeKeys);
			expect(endpoints['sub/index'].baseUrl).to.equal('/api/sub');
			expect(endpoints['sub/index'].filename).to.match(/\\testApi\\sub\\index\.js$/);
			expect(endpoints['sub/index'].routeName).to.equal('sub/index');
		});

		it('should generate a route for /api/sub/subs', function() {
			expect(endpoints['sub/subs']).to.exist;
			expect(endpoints['sub/subs']).to.have.all.keys(routeKeys);
			expect(endpoints['sub/subs'].baseUrl).to.equal('/api/sub/subs');
			expect(endpoints['sub/subs'].filename).to.match(/\\testApi\\sub\\subs\.js$/);
			expect(endpoints['sub/subs'].routeName).to.equal('sub/subs');
		});

		it('should generate a route for /api/sub/level3', function() {
			expect(endpoints['sub/level3/index']).to.exist;
			expect(endpoints['sub/level3/index']).to.have.all.keys(routeKeys);
			expect(endpoints['sub/level3/index'].baseUrl).to.equal('/api/sub/level3');
			expect(endpoints['sub/level3/index'].filename).to.match(/\\testApi\\sub\\level3\\index\.js$/);
			expect(endpoints['sub/level3/index'].routeName).to.equal('sub/level3/index');
		});

	});

	describe('/api', function() {

		it('should return \'Hello world\'', function(done) {
			r.get('/api')
				.expect('Hello, world')
				.end(done);
		});

	});

	describe('/api/user', function() {

		it('should return a user object', function(done) {
			r.get('/api/user')
				.expect({
					id: 10,
					username: 'test user'
				})
				.end(done);
		});

		describe('/id', function() {

			it('should support sub routes in one file', function(done) {
				r.get('/api/user/id')
					.expect({'test user': 10})
					.end(done);
			});

		});
	});

	describe('/api/sub', function() {

		it('should return a message from a route inside a sub folder', function(done) {
			r.get('/api/sub')
				.expect({
					message: 'This is a sub route'
				})
				.end(done);
		});

		describe('/subroutes', function() {

			it('should return a message', function(done) {
				r.get('/api/sub/subs')
					.expect({
						message: 'This is another sub route'
					})
					.end(done);
			});

		});

		describe('/level3', function() {

			it('should return a message from the third level', function(done) {

				r.get('/api/sub/level3')
					.expect({
						message: 'A message from the third level'
					})
					.end(done);

			});

		});

	})
});
