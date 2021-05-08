const db = require('../database/index.js');
const format = require('../lib/format.js');

const getPhotos = async(id) => {
  let photos = await db.query(`SELECT * FROM photos WHERE id_answers = ${id}`);
  return photos;
}

const getAnswers = async(id, page, count, layout) => {
  let answers = await db.query(`SELECT * FROM answers WHERE id_questions = ${id}`);
  for (let i = 0; i < answers.length; i ++) {
    answers[i].photos = await getPhotos(answers[i].answer_id);
  }
  answers = layout === 'answers' ?
  format.answers(answers, id, page, count) :
  format.questionAnswers(answers);
  return answers;
}

const getQuestions = async(id, page, count) => {
  let questions = await db.query(`SELECT * FROM questions WHERE product_id = ${id}`);
  for (let i = 0; i < questions.length; i ++) {
    questions[i].answers = await getAnswers(questions[i].question_id, 1, 99, 'questions');
  }
  questions = format.questions(questions, id, count);
  return questions;
}


module.exports = {
  getPhotos,
  getAnswers,
  getQuestions
}