const express = require('express');
const controllers = require('./controllers');

const app = express();
app.use(express.json());
// app.use(express.urlencoded());

app.get('/', (req, res) => {
  controllers.getReviews(req, res);
});

app.get('/meta', (req, res) => {
  controllers.getMeta(req, res);
});

app.post('/create', (req, res) => {
  controllers.postReview(req, res);
});

app.put('/:review_id/helpful', (req, res) => {
  controllers.addHelpful(req, res);
});

app.put('/:review_id/report', (req, res) => {
  controllers.reportReview(req, res);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000);
}

module.exports = app;
