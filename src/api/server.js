require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('./config/db');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
MongoClient.connect(dbConfig.url, (err, database) => {
  if (err) return console.log(err);

  // Make sure you add the database name and not the collection name
  const db = database.db(process.env.DB_NAME);

  routes(app, db);
  app.listen(port, () => {
    console.log(`API is live on port ${port}!`);
  });
})

