var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.send({
		id: 10,
		username: 'test user'
	});
});

router.get('/id', function(req, res) {
	res.send({
		'test user': 10
	});
});

module.exports = router;