var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send({ message: 'A message from the third level' });
});

module.exports = router;