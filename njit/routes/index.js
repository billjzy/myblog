var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res,next){
	res.render('register', {title: 'Register'});
});

router.post('/register', sign.signup);

module.exports = router;
