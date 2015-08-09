var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', sign.showSignup);

router.post('/register', sign.signup);

router.get('/signin', sign.showSignin);
router.post('/signin', sign.signin);

router.get('/signout', sign.signout);
module.exports = router;
