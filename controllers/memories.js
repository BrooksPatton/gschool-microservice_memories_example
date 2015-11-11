var db = require('../models/memories');

var memoriesController = {};

memoriesController.getAll = function(req, res, next) {
	var memoryQuery = db.query('SELECT * from memories');

	var result = {
		links: {
			self: req.headers.host + req.originalUrl
		},
		data: []
	};

	var rawData = [];

	memoryQuery.on('row', function(row) {
		rawData.push(row);
	});

	memoryQuery.on('end', function() {
		result.data = rawData.map(function(memory) {
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

		res.json(result);
	});
};

module.exports = memoriesController;