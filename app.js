var PORT = process.env.PORT || 3000;

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var memoryRoutes = require('./routes/memory');

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'));

app.use('/api/v1', memoryRoutes);

var server = app.listen(PORT, function () {
	console.log('Server running on port %d', server.address().port);
});

module.exports = app;