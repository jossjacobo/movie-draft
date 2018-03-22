var moviesController = require('./movies-controller');
var Movies = require('./movies-model');
var configController = require('../config/config-controller');

module.exports = function (app) {
  app.get('/api/movies', async (req, res) => {
    var skip = req.query.skip ? Number.parseInt(req.query.skip) : 0;
    var limit = req.query.limit ? Number.parseInt(req.query.limit) : null;
    var startDate = req.query.start_date ? Date.parse(req.query.start_date) : Date.now();
    var endDate = req.query.end_date ? Date.parse(req.query.end_date) : null;
    var originalLanguage = req.query.original_language || 'en';

    var releaseDate = {
      $gt: startDate
    }
    if (endDate) {
      releaseDate.$lt = endDate;
    }

    var config = await configController.getConfig();
    Movies.find({
      release_date: releaseDate,
      original_language: originalLanguage
    })
      .skip(skip)
      // If limit is 0 or a negative number pass null to grab all
      .limit(limit && limit <= 0 ? null : limit)
      .then(movies => {
        var response = {
          results: movies,
          meta: {
            count: movies.length,
            config: config
          }
        };
        res.send(response);
      })
      .catch(err => res.send(err));
  });

  app.get('/api/movies/:id', async (req, res) => {
    Movies.findOne({ id: req.params.id })
      .then(movie => res.send(movie))
      .catch(err => res.send(err));
  });

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