var Agenda = require('agenda');
var dbConfig = require('../config/db');
var moviesController = require('../routes/movies/movies-controller');
var configController = require('../routes/config/config-controller');

var agenda = new Agenda({ db: { address: dbConfig.url } });

agenda.define('fetch and update tmdb config', (job, done) => {
  console.log(`[agenda] -- ${job.attrs.name}`);
  configController.fetchAndUpdateTmdb()
    .then(config => {
      console.log(`[agenda] updated tmdb config`);
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
});

agenda.define('fetch and update upcoming movies', (job, done) => {
  console.log(`[agenda] -- ${job.attrs.name}`);
  moviesController.fetchAndUpcomingMoviesBasicInfo()
    .then(movies => {
      console.log(`[agenda] fetched and updated ${movies.length} movies`);
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
});

agenda.define('fetch and flag movies with pending changes', (job, done) => {
  console.log(`[agenda] -- ${job.attrs.name}`);
  moviesController.fetchAndFlagMoviesWithPendingChanges()
    .then(result => {
      console.log(`[agenda] flagged ${result.length} movie(s) with detailsFetched=false`);
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
});

agenda.define('update movie details', (job, done) => {
  moviesController.fetchAndUpdateMovieDetails()
    .then(movies => {
      if (movies && movies.length > 0) {
        console.log(`[agenda] -- ${job.attrs.name}`);
        console.log(`[agenda] updated ${movies.length} movie(s) details`);
      }
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
});

agenda.on('ready', () => {
  agenda.every(process.env.UPDATE_TMDB_CONFIG_INTERVAL, 'fetch and update tmdb config');
  agenda.every(process.env.UPDATE_UPCOMING_MOVIES_INTERVAL, 'fetch and update upcoming movies');
  agenda.every(process.env.FLAG_MOVIES_WITH_PENDING_CHANGES_INTERVAL, 'fetch and flag movies with pending changes');
  agenda.every(process.env.UPDATE_MOVIE_DETAILS_INTERVAL, 'update movie details');
});

module.exports = agenda;