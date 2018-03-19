var mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
  text: String,
  title: String
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;