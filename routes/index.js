var express = require('express');
var router = express.Router();
var notesRoutes = require('./notes');
var configRoute = require('./config').routes;

module.exports = function (app, db) {
  notesRoutes(app, db);
  configRoute(app, db);
};