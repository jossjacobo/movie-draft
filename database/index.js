var dbConfig = require('../config/db');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', (err) => console.error.bind(console, `connection error: ${err}`));
db.once('open', () => {
  console.log('Connected');
});

module.exports = {
  mongoose,
  db
}