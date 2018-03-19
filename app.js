require('dotenv').config();
require('es6-promise').polyfill();
require('isomorphic-fetch');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var mongoose = require('./database');
var dbConfig = require('./config/db');

var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(dbConfig.url, (err, database) => {
  if (err) return console.log(err);

  const db = database.db(process.env.DB_NAME);
  routes(app, db);

  // Serve static files from React App
  app.use(express.static(path.join(__dirname, 'client/build')));

  // The catchall handler: for any requests that don't match one above,
  // send back the React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
});



// TODO uncomment once I figure out how to send traffic back from react app to express for /api/*
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// TODO uncomment once I figure out how to send traffic back from react app to express for /api/*
// error handler 
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
