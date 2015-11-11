var pg = require('pg');
var config = require('../config/config');

var client = new pg.Client(config.database);

module.exports = client;