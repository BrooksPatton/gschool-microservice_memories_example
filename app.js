var PORT = process.env.PORT || 3000;

var express = require('express');
var cors = require('cors');
var memoryRoutes = require('./routes/memory');
var dbClient = require('./models/memories');

dbClient.connect(function(err) {
	if(err) {
		console.log('Error connecting to the database', err);

		process.exit(100);
	};
});

var app = express();

app.use(cors());

app.use(express.static('public'));

app.use('/api/v1', memoryRoutes);

var server = app.listen(PORT, function () {
	console.log('Server running on port %d', server.address().port);
});

module.exports = app;