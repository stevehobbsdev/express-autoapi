var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send({ message: 'Hello from sub api!' });
});

router.get('/test', function(req, res) {
	res.send({ message: 'Testing from sub api!' });
});

module.exports = router;