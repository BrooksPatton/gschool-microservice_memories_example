var pg = require('pg');
var config = require('../config/config');

var memoriesController = {};

memoriesController.getAll = function(req, res, next) {
	var queryDatabase = function(err, client, done) {
		if(err) return next(err);

		client.query('SELECT * from memories', function(err, results) {
			done();

			if(err) return next(err);

			var memories = {
				links: {
					self: req.headers.host + req.originalUrl
				},
				data: []
			};

			memories.data = results.rows.map(function(memory) {
				return {
					type: 'memory',
					id: memory.id,
					attributes: {
						old_days: memory.old_days,
						these_days: memory.these_days,
						year: parseInt(memory.year)
					},
					links: {
						self: req.headers.host + req.originalUrl + '/' + memory.id
					}
				};
			});
			
			res.json(memories);
		});
	};

	pg.connect(config.database, queryDatabase);
};

memoriesController.insert = function(req, res, next) {
	var insertData = function(err, client, done) {
		if(err) return next(err);

		client.query('INSERT INTO memories(old_days, these_days, year) values($1, $2, $3) RETURNING id;',
			[req.body.data.attributes.old_days,
			req.body.data.attributes.these_days,
			req.body.data.attributes.year], function(err, result) {
				done();

				if(err) return next(err);

				var memory = {
					links: {},
					data: {
						type: 'memory',
						id: result.rows[0].id,
						attributes: {
							old_days: req.body.data.attributes.old_days,
							these_days: req.body.data.attributes.these_days,
							year: req.body.data.attributes.year
						},
						links: {
							self: req.headers.host + req.originalUrl + '/' + result.rows[0].id
						}
					}
				};

				res.status(201).json(memory);
			});
	};

	pg.connect(config.database, insertData);
};

memoriesController.getAllInYear = function(req, res, next) {
	var queryDatabase = function(err, client, done) {
		if(err) return next(err);

		client.query('SELECT * from memories WHERE year=$1', [req.params.year], function(err, results) {
			done();

			if(err) return next(err);

			var memories = {
				links: {
					self: req.headers.host + req.originalUrl
				},
				data: []
			};

			memories.data = results.rows.map(function(memory) {
				return {
					type: 'memory',
					id: memory.id,
					attributes: {
						old_days: memory.old_days,
						these_days: memory.these_days,
						year: parseInt(memory.year)
					},
					links: {
						self: req.headers.host + req.originalUrl + '/' + memory.id
					}
				};
			});
			
			res.json(memories);
		});
	};

	pg.connect(config.database, queryDatabase);
};

memoriesController.getAllYears = function(req, res, next) {
	var queryDatabase = function(err, client, done) {
		if(err) return next(err);

		client.query('SELECT DISTINCT year FROM memories ORDER BY year ASC', function(err, results) {
			done();

			if(err) return next(err);

			var years = {
				links: {self: req.headers.host + req.originalUrl},
				data: results.rows.map(mapYears)
			};

			res.json(years);
		});
	};

	var mapYears = function(year) {
		return parseInt(year.year);
	};

	pg.connect(config.database, queryDatabase);
};

module.exports = memoriesController;