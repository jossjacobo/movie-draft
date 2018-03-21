var moviesController = require('./movies-controller');

module.exports = function (app) {
  // TODO write movie content fetching routes
  // app.get('/api/movies', (req, res) => {
  //
  // });

  // Movie Update Routes
  app.get('/api/update/movies', (req, res) => {
    moviesController.fetchAndUpcomingMoviesBasicInfo()
      .then(movies => res.send(movies))
      .catch(err => res.send(err));

  });

  app.get('/api/update/movie-details', (req, res) => {
    moviesController.fetchAndUpdateMovieDetails()
      .then(movies => res.send(movies))
      .catch(err => res.send(err));
  });
}