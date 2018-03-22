var configController = require('./config-controller');

module.exports = function (app) {
  app.get('/api/config', (req, res) => {
    configController.fetchAndUpdateTmdb()
      .then(config => res.send(config))
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });
}