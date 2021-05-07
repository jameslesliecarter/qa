const express = require('express');
const db = require('../database/index.js');
const Promise = require('bluebird');
const queryAsync = Promise.promisify(db.query).bind(db);

const getQuestionsByProductId = (productId) => {
  return queryAsync(`SELECT * FROM questions WHERE product_id = ${productId}`);
}

let app = express();

// app.use((req, res, next) => {
//   console.log(`${req.method} request to ${req.originalUrl}`)
//   next();
// });

app.get('/qa/questions', (req, res, next) => {
  if (!req.query.product_id) {
    res.status(404);
    res.send('No product ID given');
    res.end();
  } else {
    getQuestionsByProductId(req.query.product_id)
    .then((data) => {
      res.json(data);
      res.status(200);
      res.end();
    })
    .catch((error) => {
      console.error('Question query error: ', error);
      res.status(500);
      res.end();
    });
  }
});

app.get('/qa/test', (req, res, next) => {
  db.query(`SELECT * FROM questions WHERE product_id = ${req.query.product_id}`, (error, results, fields) => {
    res.json(results);
    res.status(201);
    res.end();
  });
});

module.exports = app;