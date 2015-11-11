var express = require('express');
var memoriesController = require('../controllers/memories');
var middleware = require('../middleware/middleware');

var memoryRouter = express.Router();

memoryRouter.get('/memories', memoriesController.getAll);
memoryRouter.post('/memories', middleware.postMemory, memoriesController.insert);

module.exports = memoryRouter;