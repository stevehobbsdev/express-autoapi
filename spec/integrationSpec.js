var expect = require('chai').expect;
var request = require('supertest');
var express = require('express');
var api = require('../index');
var path = require('path');

describe('The test integration api', function() {

	var app;
	var r;

	before(function() {
		
		app = express();

		api.setup({
			app: app,
			source: path.join(__dirname, 'testApi'),
			debug: true
		});

		r = request(app);

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

		// describe('/subroutes', function() {

		// 	it('should return a message', function(done) {
		// 		r.get('/api/sub/subroutes')
		// 			.expect({
		// 				message: 'This is another sub route'
		// 			})
		// 			.end(done);
		// 	});

		// });

	})
});
