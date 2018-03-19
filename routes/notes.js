var Note = require('./models/notes');

module.exports = function (app, db) {
  app.get('/api/notes', (req, res) => {
    Note.find((err, results) => {
      if (err) res.send({ 'error': `An error has occured: ${err}` });
      res.send(results);
    });
  });

  app.get('/api/notes/:id', (req, res) => {
    Note.findOne({ _id: req.params.id }, (err, notes) => {
      if (err) res.send({ 'error': `An error has occured: ${err}` });
      res.send(notes);
    });
  });

  app.post('/api/notes', (req, res) => {
    var note = new Note({
      text: req.body.body,
      title: req.body.title
    });
    note.save((err, note) => {
      if (err) res.send({ 'error': `An error has occured: ${err}` });
      res.send(note);
    })
  });

  app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    Note.remove({ _id: id }, (err) => {
      if (err) res.send({ 'error': `An error has occured: ${err}` });
      res.send({
        '_id': id,
        'status': `Note ${id} deleted!`
      });
    });
  });

  app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = {
      title: req.body.title,
      text: req.body.body
    }
    Note.findByIdAndUpdate(id, note, (err, udpatedNote) => {
      if (err) res.send({ 'error': `An error has occured: ${err}` });
      res.send(udpatedNote);
    });
  });

}