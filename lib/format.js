const _ = require('underscore');

const answers = (answers, id, page, count) => {
  answers = answers.splice((page - 1) * 5 , page * 5 + count);
  for (var i = 0; i < answers.length; i ++) {
    answers[i].photos = _.pluck(answers[i].photos, 'url');
  }
  answerResults = {
    'question': id,
    'page': page,
    'count': count,
    'results': answers
  };
  return answerResults;
};

module.exports = {
  answers
}