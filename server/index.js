const express = require('express');
const controllers = require('./controllers.js');
const app = express();

app.get('/', function (req, res) {
  controllers.getReviews(req, res);
});

app.get('/meta', function (req, res) {
  controllers.getMeta(req, res);
});

app.post('/', function (req, res) {
  controllers.postReview(req, res);
})

app.put('/:review_id/helpful', function (req, res) {
  controllers.addHelpful(req, res);
})

app.put('/:review_id/report', function (req, res) {
  controllers.reportReview(req, res);
})

app.listen(8080)