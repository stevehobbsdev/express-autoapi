var utils = {

	/**
	 * Combines two uri paths to produce /uri1/uri2, adding slashes where necessary
	 * @param uri1 The first path to combine
	 * @param uri2 The second path to combine
	 */
	combineApiPath: function(uri1, uri2) {

		uri1 = uri1 || "";
		uri2 = uri2 || "";

		if(!uri1.match(/^\//g))
			uri1 = '/' + uri1;

		if(!uri1.match(/\/$/g) && uri2)
			uri1 = uri1 + "/";

		if(uri2.match(/^\//g))
			uri2 = uri2.substring(1);

		return uri1 + uri2;
	}

};

module.exports = utils;