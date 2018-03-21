var mongoose = require('mongoose');

var MoviesSchema = mongoose.Schema({
  detailsFetched: {
    type: Boolean,
    require: true,
    default: false
  },
  adult: Boolean,
  backdrop_path: String,
  budget: Number,
  genres: [{
    id: Number,
    name: String
  }],
  homepage: String,
  id: {
    type: String,
    require: true,
    unique: true
  },
  imdb_id: String,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  production_companies: [{
    name: String,
    id: Number,
    logo_path: String,
    origin_country: String
  }],
  production_countries: [{
    iso_3166_1: String,
    name: String
  }],
  release_date: Date,
  revenue: Number,
  runtime: Number,
  spoken_languages: [{
    iso_639_1: String,
    name: String
  }],
  status: String,
  tagline: String,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number
});

var Movies = mongoose.model('movies', MoviesSchema);

module.exports = Movies;