var mongoose = require('mongoose');

var ConfigSchema = mongoose.Schema({
  images: {
    base_url: String,
    secure_base_url: String,
    backdrop_sizes: [String],
    logo_sizes: [String],
    poster_sizes: [String],
    profile_sizes: [String],
    still_sizes: [String]
  },
  change_keys: [String]
});

var Config = mongoose.model('config', ConfigSchema);

module.exports = Config;