var app = require('../njit/app');
var request  = require('supertest');
var should = require('should');

describe('test/app.test.js', function(){
	it('should  / status 200', function(done){
		request(app).get('/')
		.expect(200, function(err, res){
			res.text.should.containEql('Express');
			done();
		});
		});
});