const routes = require('./routes');

module.exports = function (app, db) {
  routes(app, db);
  // other routes can go here
};