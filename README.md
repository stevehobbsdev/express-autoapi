# express-autoapi

A node module for Express that automatically creates routes based on files in a folder. Point the api at a folder containing JavaScript files that contain API routes, and the routes will be automatically loaded and included in the routing system.

The initial use-case was for quickly building a Javascript API based simply on the files that exist in a folder, but they could be used to return any kind of result.

## Installation
Install from Node Package Manager: `npm install express-autoapi`

## Quick start

Include the module:
`var autoapi = require('express-autoapi');`

and set up the routes:
```js
autoapi.setup({
    app: app,    // The express app instance
    source: path.join(__dirname, 'api') // the path to find the api files
});
```
Given the following folder structure in the root of your node app:
```
/api
 |-- test.js
 |-- products.js
 |-- ham.js
```
The following base roots will be created:
```
/api/test
/api/products
/api/ham
```
Inside the route files, simply manipulate the Express Router in the same way that you normally would when creating routes for an application:
```js
// test.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	console.log("Api hit..");
	res.send({ message: 'Hello from /api/test!' });
});

// Serve /api/test/12
router.get('/:id', function(req, res) {
    res.send({ id: req.params.id });
});

module.exports = router;
```
Thus, this module can be used to work with any existing application where the routing files are kept together in a folder.

## Applying routes to the root url
By default, creating a module with the name `index.js` inside your api source folder will cause the routes to be applied to `/api` instead of `/api/<module name>`. This default name can be configured using the `rootModule` setting:

```js
autoapi.setup({
    app: app,    // The express app instance
    source: path.join(__dirname, 'api'), // the path to find the api files
    rootModule: 'test'  // cause all roots in 'test.js' to exist on '/api' instead of '/api/test'
});
```

# Options

## app
*required* - sets the express application instance to use when defining the roots (required)

## source
*required* - sets the folder to look for routing files (required). Should be an absolute path, or anything that is accepted by `fs.readFileSync`.

## root
*optional* - sets the url root of the api. Default is `'/api'`

## rootModule
*optional* - nominates a module name to use as the 'default', where the routes are applied to the api root. Default is 'index'.

## debug
*optional* - enables debug mode (false by default), which writes out debug information to the console about the files that it has found to generate the routing information from and their urls.