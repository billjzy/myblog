var app = require('../njit/app');
var request = require('supertest')(app);
var should = require('should');
var UserProxy = require('../njit/proxy').User;

describe('test/controller/sign.test.js', function(){
   var now = +new Date();
   var email = 'jinzhangyi'+ now + '@gmail.com';
   var pass = 'wtfffffffff';
   describe('sign up', function(){
     it('should vist sign up page', function(done){
        request.get('/register').expect(200, function(err, res){
        	res.text.should.containEql('Retype-Password');
        	done(err);
        });
     });

     it('should sign up a user', function(){
       request.post('/register').send({
          email: email,
          pass: pass,
          re-pass: pass
       }).expect(200, function(err, res){
        should.not.exists(err);
        res.text.should.containEql('Retype-Password');

        UserProxy.getUserByEmail(email, function(err, user){
           should.not.exits(err);
           user.should.ok;
           done();
        });
       });
     });
     

  

     });


   });


});