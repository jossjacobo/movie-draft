var notesRoutes = require('./notes/notes-routes');
var configRoute = require('./config/config-routes');
var movieRoutes = require('./movies/movies-routes');

module.exports = function (app) {
  notesRoutes(app);
  configRoute(app);
  movieRoutes(app);
};