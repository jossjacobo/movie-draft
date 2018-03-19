var dbConfig = import('../config/db');
var tmdbConfig = import('../config/tmdb');

module.exports = function (app, db) {
  app.get('/api/movies/update', (req, res) => {
    db.collection(dbConfig.tmdb_movies_collection).find({}, (err, items) => {
      if (err) {
        res.send({ 'error': `An error has occured: ${err}` });
      } else {
        items.toArray().then((result) => {
          res.send(result);
        }, (err) => {
          res.send({ 'error': `An error has occured: ${err}` });
        });
      }
    });
  });
}