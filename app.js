var PORT = process.env.PORT || 3000;

var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(express.static('public'));

var server = app.listen(PORT, function () {
	console.log('Server running on port %d', server.address().port);
});