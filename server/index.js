const express = require('express');
const _ = require('underscore');
const bodyParser = require('body-parser');
// const db = require('../database/index.js');
// const Promise = require('bluebird');
// const queryAsync = Promise.promisify(db.query).bind(db);
const q = require('./query.js');
const format = require('../lib/format.js');

let app = express();

app.use(bodyParser.json());

// // ========== QUESTIONS GET =======================

app.get('/qa/questions/', (req, res) => {
  page = req.query.page ? req.query.page : 1;
  count = req.query.count ? req.query.count: 5;
  q.getQuestions(req.query.product_id, page, count)
    .then((data) => {
      res.json(data);
      res.status(200);
      res.end();
    })
})

// //================ ANSWERS GET============================

app.get('/qa/questions/:question_id/answers', (req, res) => {
  page = req.query.page ? req.query.page : 1;
  count = req.query.count ? req.query.count : 5;
  q.getAnswers(req.params.question_id, page, count, 'answers')
    .then((data) => {
      res.json(data);
      res.status(200);
      res.end();
    });
});

// // ============ QUESTIONS POST ==========================



// // ================ ANSWER POST ====================



// // ============== MARK QUESTION HELPFUL ====================



// // ============== REPORT QUESTION =======================



// // ============= MARK ANSWER HELPFUL ======================



// // =========== REPORT ANSWER =============================



app.get('/test', (req, res) => {
  q.getPhotos(132)
    .then(data => {
      console.log(format.photos(data));
      res.status(200);
      res.end();
    })
})

module.exports = app;