var mongoose = require('mongoose');

var Images = mongoose.Schema({
  base_url: String,
  secure_base_url: String,
  backdrop_sizes: [String],
  logo_sizes: [String],
  poster_sizes: [String],
  profile_sizes: [String],
  still_sizes: [String]
});
var ConfigSchema = mongoose.Schema({
  images: [Images],
  change_keys: [String]
});

var Config = mongoose.model('Config', ConfigSchema);

module.exports = Config;