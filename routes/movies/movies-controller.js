// @ts-check

var _ = require('underscore');
var tmdb = require('../tmdb');
var Movies = require('./movies-model');
var configController = require('../config/config-controller');
var cheerio = require('cheerio');

function getUpcomingMovies(page = 1) {
  return fetch(`${tmdb.host}/movie/upcoming?api_key=${tmdb.api_key}&page=${page}`);
}

function getMovieDetails(id) {
  return fetch(`${tmdb.host}/movie/${id}?api_key=${tmdb.api_key}`);
}

function getMovieChanges(page = 1) {
  return fetch(`${tmdb.host}/movie/changes?api_key=${tmdb.api_key}&page=${page}`)
    .then(response => response.json());
}

function fillArray(page) {
  var pages = [];
  var i;
  for (i = 1; i <= page; i++) {
    pages.push(i);
  }
  return pages;
}

function buildImageUrls(movies, config) {
  if (config) {
    var moviesWithImageUrls = movies.map(movie => {
      if (movie.backdrop_path) {
        movie.backdrop = `${config.images.secure_base_url}${config.images.backdrop_sizes[config.images.backdrop_sizes.length - 1]}${movie.backdrop_path}`;
      }
      if (movie.poster_path) {
        movie.poster = `${config.images.secure_base_url}${config.images.poster_sizes[config.images.poster_sizes.length - 1]}${movie.poster_path}`;
      }
      if (movie.production_companies) {
        movie.production_companies.map(company => {
          if (company.logo_path) {
            company.logo = `${config.images.secure_base_url}${config.images.logo_sizes[config.images.logo_sizes.length - 1]}${company.logo_path}`
          }
          return company;
        })
      }
      return movie;
    });
    return moviesWithImageUrls;
  }
  return movies;
}

/**
 * Find Mojo ID crawls the boxofficemojo.com website for the mojoId.
 * Currently the approach is to use it's built in search and grab the 
 * first result (sorted by desc. release date)
 * 
 * Method will return an promise with the updated movie object
 * 
 * @param {*} movie 
 */
async function findMojoId(movie) {
  if (movie.idMojo) return movie;

  var $ = await fetch(`http://www.boxofficemojo.com/search/?q=${movie.title}`)
    .then(req => req.text())
    .then(html => cheerio.load(html));

  var dates = [];
  $('[href^="/schedule/?view"]').each(function (i, elem) {
    dates.push($(this).text());
  });

  if (dates.length > 0) {
    movie.idMojo = $('td a[href^="/movies/?id="]')
      .attr('href')
      .replace('/movies/?id=', '');
  }
  return movie;
}

function findMojoRevenue(movie) {
  if (!movie || !movie.idMojo) {
    return movie;
  }

  return fetch(`http://www.boxofficemojo.com/movies/?id=${movie.idMojo}`)
    .then(req => req.text())
    .then(html => cheerio.load(html))
    .then($ => {
      var revenue = $('.mp_box_tab:contains("Lifetime") + *').find('td b').last().text();
      if (revenue) {
        movie.revenueMojo = revenue.replace(/\D/g, '');
      }
      return movie;
    });
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
        return Movies.findOneAndUpdate({ id: movie.id }, movie, { new: true, upsert: true, setDefaultsOnInsert: true });
      });
      return Promise.all(moviesSavePromises);
    })
    .then(results => {
      return _.flatten(results);
    });
}

module.exports.fetchAndUpdateMovieDetails = async function (limit = 20) {
  var config = await configController.getConfig();
  return Movies.find({ detailsFetched: false })
    .limit(limit)
    .sort({ release_date: "asc" })
    .then(results => {
      var promises = results.map(movie => {
        return getMovieDetails(movie.id)
          .then(response => response.json());
      });
      return Promise.all(promises);
    })
    .then(movies => {
      // Flag movies that details has been fetched
      movies = movies.map(movie => {
        movie.detailsFetched = true;
        return movie;
      });
      // Build full image urls if we have the config
      if (config) {
        movies = buildImageUrls(movies, config);
      }
      return movies
    })
    .then(movies => {
      var updateMoviePromises = movies.map(movie => {
        return Movies.findOneAndUpdate({ id: movie.id }, movie, { new: true, upsert: true, setDefaultsOnInsert: true });
      });
      return Promise.all(updateMoviePromises);
    })
    .then(movies => {
      var idMojoPromises = movies.map(movie => {
        return findMojoId(movie);
      });
      return Promise.all(idMojoPromises);
    })

    .then(movies => {
      var revenueMojoPromises = movies.map(movie => {
        return findMojoRevenue(movie);
      })
      return Promise.all(revenueMojoPromises);
    })
    .then(movies => {
      var updateMoviePromises = movies.map(movie => {
        return Movies.findOneAndUpdate({ id: movie.id }, movie, { new: true, upsert: true, setDefaultsOnInsert: true });
      });
      return Promise.all(updateMoviePromises);
    })
}

module.exports.fetchAndFlagMoviesWithPendingChanges = async function () {
  var config = await configController.getConfig();

  // One year range, six months before and six after than now
  var now = new Date();
  var sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6)).toISOString()
  var sixMonthsFromNow = new Date(now.setMonth(now.getMonth() + 6)).toISOString();

  // Find all movies within the range
  var movies = await Movies.find({ release_date: { $gt: sixMonthsAgo, $lt: sixMonthsFromNow } })
    .then(movies => {
      return movies;
    });

  return getMovieChanges()
    .then(json => {
      return fillArray(json.total_pages);
    })
    .then(pages => {
      var promises = pages.map(page => {
        return getMovieChanges(page)
          .then(json => json.results);
      });
      return Promise.all(promises);
    })
    .then(results => {
      return _.flatten(results);
    })
    .then(ids => {
      return ids.reduce((accumulator, current) => {
        if (current && movies.find((movie) => movie.id == current.id)) {
          accumulator.push(current.id);
        }
        return accumulator;
      }, []);
    })
    .then(ids => {
      return Promise.all(ids.map(id => {
        return Movies.findOneAndUpdate({ id: id }, { detailsFetched: false }, { new: true });
      }));
    });
}