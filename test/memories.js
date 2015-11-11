var chai = require('chai');
var request = require('supertest');
var app = require('../app');

var should = chai.should();

var canaryTest = function() {
	[].should.be.a('array');
};

var getAllMemories = function(done) {
	request(app)
		.get('/api/v1/memories')
		.expect(200)
		.end(function(err, res) {
			if(err) return done(err);
			if(res.body.data.length === 0) return done(new Error('No data'));

			res.body.links.self.should.be.a('string');
			res.body.data[0].type.should.be.equal('memory');
			res.body.data[0].id.should.be.a('number');
			res.body.data[0].attributes.old_days.should.be.a('string');
			res.body.data[0].attributes.these_days.should.be.a('string');
			res.body.data[0].attributes.year.should.be.a('number');
			res.body.data[0].links.self.should.be.a('string');

			done();
		});
};

describe('The canary test', function() {
	it('should pass', canaryTest);
});

describe('Sending a GET to /api/v1/memories', function() {
	describe('should succeed', function() {
		it('in getting all memories', getAllMemories);
	});
});