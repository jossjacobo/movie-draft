var tmdb = require('../tmdb');
var Config = require('./config-model');
var _ = require('underscore');

module.exports.fetchAndUpdateTmdb = function () {
  return fetch(`${tmdb.host}/configuration?api_key=${tmdb.api_key}`)
    .then(response => response.json())
    .then(json => {
      return Config.findOneAndUpdate({}, json, { new: true, upsert: true });
    });
}

module.exports.getConfig = async function () {
  var config = null;
  try {
    config = await Config.findOne({}).select('images').exec();
  } catch (err) {
    console.log(err);
  }
  return config;
}