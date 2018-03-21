var _ = require('underscore');
var tmdb = require('../tmdb');
var Movie = require('./movies-model');

function getUpcomingMovies(page = 1) {
  return fetch(`${tmdb.host}/movie/upcoming?api_key=${tmdb.api_key}&page=${page}`);
}

function getMovieDetails(id) {
  return fetch(`${tmdb.host}/movie/${id}?api_key=${tmdb.api_key}`);
}

function fillArray(page) {
  var pages = [];
  for (i = 1; i <= page; i++) {
    pages.push(i);
  }
  return pages;
}

module.exports.fetchAndUpcomingMoviesBasicInfo = function () {
  return getUpcomingMovies() // initial call just to get the number of pages
    .then(response => response.json())
    .then(json => {
      return fillArray(json.total_pages); // return array of all the pages [1,2,3,...]
    })
    .then(pages => {
      var promises = pages.map(page => {
        return getUpcomingMovies(page)
          .then(response => response.json())
          .then(json => json.results)
      });
      return Promise.all(promises);
    })
    .then(results => {
      return _.flatten(results);
    })
    .then(movies => {
      var moviesSavePromises = movies.map(movie => {
        return Movie.findOneAndUpdate({ id: movie.id }, movie, { new: true, upsert: true, setDefaultsOnInsert: true });
      });
      return Promise.all(moviesSavePromises);
    })
    .then(results => {
      return _.flatten(results);
    });
}

module.exports.fetchAndUpdateMovieDetails = function (limit = 40) {
  return Movie.find({ detailsFetched: false })
    .limit(limit)
    .sort({ release_date: "asc" })
    .then(results => {
      var promises = results.map(movie => {
        return getMovieDetails(movie.id)
          .then(response => response.json());
      });
      return Promise.all(promises);
    })
    .then(result => {
      return result.map(movie => {
        movie.detailsFetched = true;
        return movie;
      });
    })
    .then(movies => {
      var updateMoviePromises = movies.map(movie => {
        return Movie.findOneAndUpdate({ id: movie.id }, movie, { new: true, upsert: true, setDefaultsOnInsert: true });
      });
      return Promise.all(updateMoviePromises);
    });
}