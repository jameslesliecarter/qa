const express = require('express');
const _ = require('underscore');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const Promise = require('bluebird');
const queryAsync = Promise.promisify(db.query).bind(db);

const getQuestionsByProductId = (productId) => {
  return queryAsync(`SELECT * FROM questions WHERE product_id = ${productId}`);
};

const getAnswersByQuestionId = (questionId) => {
  return queryAsync(`SELECT * FROM answers WHERE id_questions = ${questionId}`);
};

const getPhotosByAnswerId = (answerId) => {
  return queryAsync(`SELECT * FROM photos WHERE id_answers = ${answerId}`);
};

const insertQuestionByProductId = (questionFields) => {
  return queryAsync('INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES (?,?,?,?,?,?,?)', questionFields);
};

const insertAnswerByQuestionId = (answerFields) => {
  return queryAsync('INSERT INTO answers (id_questions, body, date, answerer_name, answerer_email, reported, helpfulness) VALUES (?,?,?,?,?,?,?)', answerFields);
};

const updateQuestionHelpful = (questionId) => {
  return queryAsync(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${questionId}`);
};

let app = express();

app.use(bodyParser.json());

// ========== QUESTIONS GET =======================
app.get('/qa/questions', (req, res, next) => {
  if (!req.query.product_id) {
    return res.status(404).jston({
      status: 'error',
      error: 'no product id'
    });
  } else {
    getQuestionsByProductId(req.query.product_id)
    .then((questionData) => {
      if (questionData) {
        questionData.forEach(async function(question) {
          await getAnswersByQuestionId(question.question_id)
          .then((answerData) => {
            if (answerData) {
              answerData.forEach(async function (answer) {
                getPhotosByAnswerId(answer.answer_id)
                .then((photoData) => {
                  answer.photos = _.pluck(photoData, 'url');
                  //console.log('Answer: ', answer);
                })
                .catch((error) => {
                  console.error('Photo fetch error: ', error);
                });
              });
            }
            question.answers = answerData;
            //console.log('concatted? answer data: ', answerData);
          })
          .catch((error) => {
            console.error('Answer fetch error: ', error);
          });
        })
      }
      res.json(questionData);
      res.status(209);
      res.end();
    })
    .catch((error) => {
      console.error('Question query error: ', error);
      res.status(500);
      res.end();
    });
  }
});

//================ ANSWERS GET============================

app.get('/qa/questions/:question_id/answers', (req, res, next) => {
  // if (typeof(req.params.question_id) !== 'number') {
  //   res.status(500);
  //   res.send('No question ID given');
  //   res.end();
  // } else {
    getAnswersByQuestionId(req.params.question_id)
    .then((data) => {
      res.json(data);
      res.status(200);
      res.end();
    })
  //}
});

// ============ QUESTIONS POST ==========================

app.post('/qa/questions', (req, res, next) => {
  let {body, name, email, product_id} = req.body;
  let questionRow = [product_id, body, new Date(), name, email, 0, 0];
  insertQuestionByProductId(questionRow)
    .then(() => {
      res.status(299);
      res.end();
    })
    .catch((error) => {
      console.error('db insert error: ', error);
      res.status(500);
      res.end();
    });

});

// ================ ANSWER POST ====================

app.post('/qa/questions/:question_id/answers', (req, res, next) => {
  let {body, name, email, photos} = req.body;
  let answerRow = [Number(req.params.question_id), body, new Date(), name, email, 0, 0];
  insertAnswerByQuestionId(answerRow)
    .then(() => {
      res.status(201);
      res.end();
    })
    .catch((error) => {
      console.error('answer insert error: ', error);
      res.status(500);
      res.end();
    })
})

// ============== MARK QUESTION HELPFUL ====================

app.put('/qa/questions/:question_id/helpful', (req, res, next) => {
  updateQuestionHelpful(req.params.question_id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((error) => {
      console.error('question helpful error: ', error);
    });
})

module.exports = app;