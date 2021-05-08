const express = require('express');
const _ = require('underscore');
const bodyParser = require('body-parser');
// const db = require('../database/index.js');
// const Promise = require('bluebird');
// const queryAsync = Promise.promisify(db.query).bind(db);
const q = require('./query.js');
const format = require('../lib/format.js');

// const getQuestionsByProductId = (productId) => {
//   return queryAsync(`SELECT * FROM questions WHERE product_id = ${productId}`);
// };

// const getAnswersByQuestionId = (questionId) => {
//   return queryAsync(`SELECT * FROM answers WHERE id_questions = ${questionId}`);
// };

// const getPhotosByAnswerId = (answerId) => {
//   return queryAsync(`SELECT * FROM photos WHERE id_answers = ${answerId}`);
// };

// const insertQuestionByProductId = (questionFields) => {
//   return queryAsync('INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES (?,?,?,?,?,?,?)', questionFields);
// };

// const insertAnswerByQuestionId = (answerFields) => {
//   return queryAsync('INSERT INTO answers (id_questions, body, date, answerer_name, answerer_email, reported, helpfulness) VALUES (?,?,?,?,?,?,?)', answerFields);
// };

// const updateQuestionHelpful = (questionId) => {
//   return queryAsync(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${questionId}`);
// };

// const updateQuestionReport = (questionId) => {
//   return queryAsync(`UPDATE questions SET reported = 1 WHERE question_id = ${questionId}`);
// };

// const updateAnswerHelpful = (answerId) => {
//   return queryAsync(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answerId}`);
// };

// const updateAnswerReport = (answerId) => {
//   return queryAsync(`UPDATE answers SET reported = 1 WHERE answer_id = ${answerId}`);
// };

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
  q.getAnswers(req.query.question_id, page, count, 'answers')
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