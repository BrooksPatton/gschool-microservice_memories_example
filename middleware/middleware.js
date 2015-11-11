var middleware = {};

var ErrorObject = function(title, details) {
	this.title = title;
	this.details = details;
};

middleware.postMemory = function(req, res, next) {
	var errors = [];
	if(!req.body.data.type) errors.push(new ErrorObject('missing type', 'There is no type memories in the payload'));
	if(req.body.data.type !== 'memory') errors.push(new ErrorObject('type incorrect', 'Type must be "memory"'));

	if(errors.length !== 0) return res.status(400).send({error: errors});

	next();
};

module.exports = middleware;