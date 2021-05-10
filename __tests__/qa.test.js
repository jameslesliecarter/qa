const app = require('../server/index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('Testing Questions Endpoints', () => {
  it('Should be able to GET /qa/questions endpoint, given a product_id', async done => {
    const response = await request.get('/qa/questions/?product_id=1');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(Object.keys(response.body)).toContain('product_id');
    expect(Object.keys(response.body)).toContain('results');
    done();
  });

  it('Should return empty results when given a nonexistent product id', async done => {
    const response = await request.get('/qa/questions/?product_id=-1');
    expect(response.body.results.length).toBe(0);
    done();
  });

  it('Should fail when not given a product id', async done => {
    const response = await request.get('/qa/questions');
    expect(response.status).toBe(500);
    done();
  });

  it('Should return the correct amount of questions based on count', async done => {
    const response = await request.get('/qa/questions/?product_id=1&count=1');
    expect(response.body.results.length).toBe(1);
    done();
  });

});

describe('Testing Answers Endpoints', () => {
  it('Should return answers given a question Id', async done => {
    const response = await request.get('/qa/questions/99/answers');
    expect(response.body.results.length).toBeGreaterThanOrEqual(0);
    expect(response.status).toBe(200);
    done();
  });
  it('Should require a question_id in params', async done => {
    const response = await request.get('/qa/questions//answers');
    expect(response.status).toBe(404);
    done();
  });
  it('Should respond with requested number of results or fewer', async done => {
    const response = await request.get('/qa/questions/99/answers/?count=2');
    expect(response.body.results.length).toBeLessThanOrEqual(2);
    done();
  });

});

describe('Testing Questions POST Endpoints', () => {
  it('Should post question containing all pertinent fields', async done => {
    const response = await request.post('/qa/questions')
    .send({
      'name': 'jimmy',
      'body': 'quarstchun',
      'email': 'jim@jam.jum',
      'product_id': 99
    });
    expect(response.status).toBe(201);
    const questionGet = await request.get('/qa/questions/?product_id=99&count=1000');
    expect(questionGet.body.results[questionGet.body.results.length - 1].asker_name).toBe('jimmy');
    done();
  });
  it('Should fail on question post lacking any fields', async done => {
    const response = await request.post('/qa/questions')
    .send({
      'name': 'jummmm',
      'email': 'jim@jam.jum',
      'body': 'i failed a question'
    });
    expect(response.status).toBe(500);
    done();
  });
});

describe('Testing Answers POST Endpoints', () => {
  it('Should post a well-formatted answer', async done => {
    const response = await request.post('/qa/questions/100/answers')
    .send({
      'body': 'this is a test answer',
      'name': 'jimmy jam',
      'email': 'jim@jam.jum',
      'photos': ['https://images.unsplash.com/photo-1530519729491-aea5b51d1ee1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80']
    });
    expect(response.status).toBe(201);
    const answerGet = await request.get('/qa/questions/100/answers');
    expect(answerGet.body.results[answerGet.body.results.length - 1].body).toBe('this is a test answer');
    done();
  });
  it('Should fail on poorly formatted answers', async done => {
    const response = await request.post('/qa/questions/100/answers')
    .send({
      'body': 'this is a test body',
      'name': 'jimmothy',
      'photos': []
    });
    expect(response.status).toBe(500);
    done();
  });
});

describe('Question and Answer Helpfulness and Reporting endpoints', () => {
  it('Should increment question helpfulness on PUT', async done => {
    const qBeforeInc = await request.get('/qa/questions/?product_id=100');
    const hBeforeInc = qBeforeInc.body.results[0].question_helpfulness;
    const id = qBeforeInc.body.results[0].question_id;
    await request.put(`/qa/questions/${id}/helpful`);
    const qAfterInc = await request.get('/qa/questions/?product_id=100');
    const hAfterInc = qAfterInc.body.results[0].question_helpfulness;
    expect(hAfterInc).toBe(hBeforeInc + 1);
    done();
  });
  it('Should increment answer helpfulness on PUT', async done => {
    const aBeforeInc = await request.get('/qa/questions/328/answers');
    const hBeforeInc = aBeforeInc.body.results[0].helpfulness;
    const id = aBeforeInc.body.results[0].answer_id;
    await request.put(`/qa/answers/${id}/helpful`);
    const aAfterInc = await request.get('/qa/questions/328/answers');
    const hAfterInc = aAfterInc.body.results[0].helpfulness;
    expect(hAfterInc).toBe(hBeforeInc + 1);
    done();
  });
  xit('Should set to 1 question reported value on PUT', async done => {
    const qBeforeInc = await request.get('/qa/questions/?product_id=100');
    const id = qBeforeInc.body.results[0].question_id;
    await request.put(`/qa/questions/${id}/report`);
    const qAfterInc = await request.get('/qa/questions/?product_id=100');
    const rAfterInc = qAfterInc.body.results[0].reported;
    expect(rAfterInc).toBe(1);
    done();
  });
  xit('Should set to 1 answer reported on PUT', async done => {
    const aBeforeInc = await request.get('/qa/questions/326/answers');
    const id = aBeforeInc.body.results[0].answer_id;
    await request.put(`/qa/answers/${id}/report`);
    const aAfterInc = await request.get('/qa/questions/326/answers');
    const rAfterInc = aAfterInc.body.results[0].reported;
    expect(rAfterInc).toBe(1);
    done();
  });
  it('Should not return questions that have been reported', async done => {
    const response = await request.get('/qa/questions/?product_id=100');
    const results = response.body.results;
    for (let i = 0; i < results.length; i ++) {
      expect(results[i].reported).toBe(0);
    }
    done();
  });
  it('Should not return answers that have been reported', async done => {
    const response = await request.get('/qa/questions/328/answers');
    const results = response.body.results;
    for (let i = 0; i < results.length; i ++) {
      expect(results[i].reported).toBe(0);
    }
    done();
  });
});