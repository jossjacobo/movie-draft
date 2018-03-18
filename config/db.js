// https://mlab.com/databases/movie-draft-db
module.exports = {
  url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds251598.mlab.com:51598/${process.env.DB_NAME}`
}