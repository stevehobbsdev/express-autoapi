
var utils = require('../util.js');
var expect = require('chai').expect;

describe('the combineApiPath method', function() {
	
	it('should strip the trailing slash when combining paths', function() {

		var path1 = '/api';
		var path2 = 'test';

		var result = utils.combineApiPath(path1, path2);

		expect(result).to.equal('/api/test');
	});

	it('should add a leading slashes where necessary', function() {

		var path1 = 'api';
		var path2 = 'test';

		var result = utils.combineApiPath(path1, path2);

		expect(result).to.equal('/api/test');
	});

	it('should accept null or empty for the first argument', function() {

		var path1 = null;
		var path2 = 'test';

		var result = utils.combineApiPath(path1, path2);

		expect(result).to.equal('/test');
	});

	it('should accept null or empty for the second argument', function() {

		var path1 = '/api';
		var path2 = undefined;

		var result = utils.combineApiPath(path1, path2);

		expect(result).to.equal('/api');
	});

	it('should handle parameters that contain multiple paths', function() {

		var path1 = '/api/products';
		var path2 = 'v1/getProduct';

		var result = utils.combineApiPath(path1, path2);

		expect(result).to.equal('/api/products/v1/getProduct');
	});
});