var tmdb = require('../tmdb');
var Config = require('./config-model');

module.exports.fetchAndUpdateTmdb = function () {
  return fetch(`${tmdb.host}/configuration?api_key=${tmdb.api_key}`)
    .then(response => response.json())
    .then(json => {
      return Config.findOneAndUpdate({}, json, { new: true, upsert: true });
    });
}