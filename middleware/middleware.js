var middleware = {};

var ErrorObject = function(title, details) {
	this.title = title;
	this.details = details;
};

middleware.postMemory = function(req, res, next) {
	var errors = [];
	if(!req.body.data.type) errors.push(new ErrorObject('missing type', 'There is no type memories in the payload'));
	if(req.body.data.type !== 'memory') errors.push(new ErrorObject('type incorrect', 'Type must be "memory"'));
	if(typeof(req.body.data.attributes.old_days) !== 'string') errors.push(new ErrorObject('old_days incorrect', 'old_days must be a string'));
	if(typeof(req.body.data.attributes.these_days) !== 'string') errors.push(new ErrorObject('these_days incorrect', 'these_days must be a string'));
	if(typeof(req.body.data.attributes.year) !== 'number') errors.push(new ErrorObject('year incorrect', 'year must be a number'));
	if(req.body.data.attributes.year < 0) errors.push(new ErrorObject('year incorrect', 'year must be four positive digits'));
	if(req.body.data.attributes.year.toString().length !== 4) errors.push(new ErrorObject('year incorrect', 'year must be four digits'));

	if(errors.length !== 0) return res.status(400).send({error: errors});

	next();
};

middleware.getByYear = function(req, res, next) {
	var errors = [];

	if(req.params.year && !parseInt(req.params.year)) errors.push(new ErrorObject('year incorrect', 'year must be four positive digits'));

	if(errors.length !== 0) return res.status(400).send({error: errors});

	next();
};

module.exports = middleware;