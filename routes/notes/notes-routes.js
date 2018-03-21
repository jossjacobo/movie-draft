var Note = require('./notes-model');

module.exports = function (app) {
  app.get('/api/notes', (req, res) => {
    Note.find({})
      .then(results => res.send(results))
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });

  app.get('/api/notes/:id', (req, res) => {
    Note.findOne({ _id: req.params.id })
      .then(notes => res.send(notes))
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });

  app.post('/api/notes', (req, res) => {
    var note = new Note({
      text: req.body.body,
      title: req.body.title
    });
    note.save()
      .then(note => res.send(note))
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });

  app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    Note.remove({ _id: id })
      .then(response => {
        res.send({
          '_id': id,
          'status': `Note ${id} deleted!`
        });
      })
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });

  app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = {
      title: req.body.title,
      text: req.body.body
    }
    Note.findByIdAndUpdate(id, note, { new: true })
      .then(updatedNote => res.send(updatedNote))
      .catch(err => res.send({ 'error': `An error has occured: ${err}` }));
  });

}