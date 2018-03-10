var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = {
      '_id': new ObjectID(id)
    }
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({ 'error': `An error has occured: ${err}` });
      } else {
        res.send(item);
      }
    });
  });

  app.post('/notes', (req, res) => {
    const note = {
      text: req.body.body,
      title: req.body.title
    };
    db.collection('notes').insert(note, (err, results) => {
      if (err) {
        res.send({ 'error': `An error has occured: ${err}` });
      } else {
        res.send(results.ops[0]);
      }
    });
  });

  app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = {
      '_id': new ObjectID(id)
    };
    db.collection('notes').remove(details, (err, item) => {
      if (err) {
        res.send({ 'error': `An error has occured: ${err}` });
      } else {
        res.send({
          '_id': id,
          'status': `Note ${id} deleted!`
        });
      }
    });
  });

  app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = {
      '_id': new ObjectID(id)
    };
    const note = {
      text: req.body.body,
      title: req.body.title
    }
    db.collection('notes').update(details, note, (err, results) => {
      if (err) {
        res.send({ 'error': `An error has occured: ${err}` });
      } else {
        res.send(note);
      }
    });
  });

}