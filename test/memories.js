var chai = require('chai');
var request = require('supertest');
var app = require('../app');
var Chance = require('chance');

var should = chai.should();
var chance = new Chance();

describe('The canary test', function() {
	it('should pass', canaryTest);
});

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

var memoryMissingType = function(done) {
	var randomMemory = {
		data: {
			attributes: {
				old_days: chance.sentence(),
				these_days: chance.sentence(),
				year: chance.year()
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.error.should.be.a('array');
			res.body.error[0].title.should.be.equal('missing type');
			res.body.error[0].details.should.be.equal('There is no type memories in the payload');

			done();
		});
};

var memoryWrongType = function(done) {
	var randomMemory = {
		data: {
			type: chance.string(),
			attributes: {
				old_days: chance.sentence(),
				these_days: chance.sentence(),
				year: chance.year()
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.error.should.be.a('array');
			res.body.error[0].title.should.be.equal('type incorrect');
			res.body.error[0].details.should.be.equal('Type must be "memory"');

			done();
		});
};

var oldDaysNotString = function(done) {
	var randomMemory = {
		data: {
			type: 'memory',
			attributes: {
				old_days: chance.integer(),
				these_days: chance.sentence(),
				year: chance.year()
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.error.should.be.a('array');
			res.body.error[0].title.should.be.equal('old_days incorrect');
			res.body.error[0].details.should.be.equal('old_days must be a string');

			done();
		});
};

var theseDaysNotString = function(done) {
	var randomMemory = {
		data: {
			type: 'memory',
			attributes: {
				old_days: chance.sentence(),
				these_days: chance.integer(),
				year: chance.year()
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.error.should.be.a('array');
			res.body.error[0].title.should.be.equal('these_days incorrect');
			res.body.error[0].details.should.be.equal('these_days must be a string');

			done();
		});
};

var yearIsNotNumber = function(done) {
	var randomMemory = {
		data: {
			type: 'memory',
			attributes: {
				old_days: chance.sentence(),
				these_days: chance.sentence(),
				year: chance.word()
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(400)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.error.should.be.a('array');
			res.body.error[0].title.should.be.equal('year incorrect');
			res.body.error[0].details.should.be.equal('year must be a number');

			done();
		});
}

var addMemory = function(done) {
	var randomMemory = {
		data: {
			type: 'memory',
			attributes: {
				old_days: chance.sentence(),
				these_days: chance.sentence(),
				year: parseInt(chance.year())
			}
		}
	};

	request(app)
		.post('/api/v1/memories')
		.send(randomMemory)
		.expect(201)
		.end(function(err, res) {
			if(err) return done(err);

			res.body.links.should.be.a('object');
			res.body.data.type.should.be.equal(randomMemory.data.type);
			res.body.data.id.should.be.a('number');
			res.body.data.attributes.old_days.should.be.equal(randomMemory.data.attributes.old_days);
			res.body.data.attributes.these_days.should.be.equal(randomMemory.data.attributes.these_days);
			res.body.data.attributes.year.should.be.equal(randomMemory.data.attributes.year);
			res.body.data.links.self.should.be.a('string');

			done();
		});
};

describe('Sending a GET to /api/v1/memories', function() {
	describe('should succeed', function() {
		it('in getting all memories', getAllMemories);
	});
});

describe('Sending a POST to /api/v1/memories', function() {
	describe('should fail', function() {
		it('when a payload type is not included', memoryMissingType);
		it('when a payload type is not "memory"', memoryWrongType);
		it('when old_days is not a string', oldDaysNotString);
		it('when these_days is not a string', theseDaysNotString);
		it('when the year is not a number', yearIsNotNumber);
	});

	describe('should succeed', function() {
		it('in inserting a memory into the database', addMemory);
	});
});