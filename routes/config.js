var dbConfig = require('../config/db');
var tmdbConfig = require('../config/tmdb');
var ObjectID = require('mongodb').ObjectID;

var config = function (db) {
  db.collection(dbConfig.tmdb_config_collection).find({}, (err, items) => {
    if (err) {
      return { 'error': `An error has occured: ${err}` };
    } else {
      items.toArray()
        .catch((err) => {
          return { 'error': `An error has occured: ${err}` };
        })
        .then((result) => {
          return result[0];
        }, (err) => {
          return { 'error': `An error has occured: ${err}` };
        });
    }
  });
}

var routes = function (app, db) {
  console.log(`initial config: ${config(db)}`);
  app.get('/api/config', (req, res) => {
    fetch(`${tmdbConfig.host}/configuration?api_key=${tmdbConfig.api_key}`)
      .then(response => response.json())
      .catch(err => res.send(err))
      .then(json => {

        var value = {
          config: json
        };

        // var cursor = db.collection(dbConfig.tmdb_config_collection).find({});
        // if (cursor.hasNext()) {
        //   var details = {
        //     '_id': cachedConfig && cachedConfig._id ? new ObjectID(cachedConfig._id) : null
        //   };
        // } else {

        // }
        var cachedConfig = config(db);
        var details = {
          _id: cachedConfig && cachedConfig._id ? new ObjectID(cachedConfig._id) : null
        }
        if (details._id) {
          db.collection(dbConfig.tmdb_config_collection).update(details, value, (err, results) => {
            if (err) {
              res.send({ 'error': `An error has occured: ${err}` });
            } else {
              res.send(json);
            }
          });
        } else {
          db.collection(dbConfig.tmdb_config_collection).insert(value, (err, results) => {
            if (err) {
              res.send({ 'error': `An error has occured: ${err}` });
            } else {
              res.send(json);
            }
          });
        }
      })
      .catch(err => console.log(err));
  });
}

module.exports = {
  config,
  routes
}