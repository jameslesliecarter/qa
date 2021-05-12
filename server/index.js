const express = require('express');
const bodyParser = require('body-parser');
const q = require('./query.js');
const format = require('./lib/format.js');

let app = express();

app.use(bodyParser.json());

// // ========== QUESTIONS GET =======================

app.get('/qa/questions/', (req, res) => {
  if (!req.query.product_id) {
    res.status(500);
    res.end();
  } else {
    page = req.query.page ? req.query.page : 1;
    count = req.query.count ? req.query.count: 5;
    q.getQuestions(req.query.product_id, page, count)
    .then((data) => {
      res.json(data);
      res.status(200);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(404);
      res.end();
    })
  }
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
    })
    .catch((error) => {
      res.send(error);
      res.status(404);
      res.end();
    })
});

// // ============ QUESTIONS POST ==========================

app.post('/qa/questions', (req, res) => {
  let {body, name, email, product_id} = req.body;
  if (!(body && name && email && product_id)) {
    res.status(500);
    res.end();
  } else {
    q.postQuestion(body, name, email, product_id)
    .then((response) => {
      res.status(201);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
  }
});

// // ================ ANSWER POST ====================

app.post('/qa/questions/:question_id/answers', (req, res) => {
  let {body, name, email, photos} = req.body;
  if(!(body && name && email && photos)){
    res.status(500);
    res.end();
  } else {
    q.postAnswer(req.params.question_id, body, name, email, photos)
    .then(() => {
      res.status(201);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
  }
});

// // ============== MARK QUESTION HELPFUL ====================

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  q.helpfulQuestion(req.params.question_id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
});

// // ============== REPORT QUESTION =======================

app.put('/qa/questions/:question_id/report', (req, res) => {
  q.reportQuestion(req.params.question_id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
});

// // ============= MARK ANSWER HELPFUL ======================

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  q.helpfulAnswer(req.params.answer_id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
});

// // =========== REPORT ANSWER =============================

app.put('/qa/answers/:answer_id/report', (req, res) => {
  q.reportAnswer(req.params.answer_id)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((error) => {
      res.send(error);
      res.status(500);
      res.end();
    });
});

// ===== TEST=====
app.get('/test', (req, res) => {
  console.log('host: ', req.headers.host);
  res.status(200);
  res.send('hello world');
  res.end();
});

module.exports = app;