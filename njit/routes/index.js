var express = require('express');
var router = express.Router();
var sign = require('../controller/sign');
var site = require('../controller/site');
var user = require('../controller/user');
var blog = require('../controller/blog');
var auth  = require('../middlewares/auth');

router.get('/', site.index);

router.get('/register', sign.showSignup);
router.post('/register', sign.signup);

router.get('/signin', sign.showSignin);
router.post('/signin', sign.signin);

router.get('/signout', sign.signout);

router.get('/user/:name', user.index);

router.get('/setting', auth.userRequired, user.showProfile);

router.post('/setting', auth.userRequired, user.profile);

router.get('/blog/create', blog.create);//create new blog
router.get('/blog/:bid', blog.index);//show blog(:bid)

//post new blog
//update



module.exports = router;
