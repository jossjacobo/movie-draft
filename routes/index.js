var express = require('express');
var router = express.Router();
var notesRoutes = require('./notes');

module.exports = function (app, db) {
  app.get("/", (req, res) => {
    res.send("/");
  });

  notesRoutes(app, db);
};