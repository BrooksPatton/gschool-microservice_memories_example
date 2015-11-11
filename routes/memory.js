var express = require('express');
var memoriesController = require('../controllers/memories');

var memoryRouter = express.Router();

memoryRouter.get('/memories', memoriesController.getAll);
memoryRouter.post('/memories', memoriesController.insert);

module.exports = memoryRouter;