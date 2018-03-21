// https://mlab.com/databases/movie-draft-db
module.exports = {
  url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SUB_DOMAIN}.mlab.com:${process.env.DB_PORT}/${process.env.DB_NAME}`
}