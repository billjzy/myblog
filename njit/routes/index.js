var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
var site = require('../controller/site');

router.get('/', site.index);



router.get('/register', sign.showSignup);

router.post('/register', sign.signup);

router.get('/signin', sign.showSignin);
router.post('/signin', sign.signin);

router.get('/signout', sign.signout);
module.exports = router;
