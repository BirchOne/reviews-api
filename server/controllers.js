const models = require('./models.js');

module.exports = {
  getReviews: function (req, res) {
    models.getReviews(req, res, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  getMeta: function (req, res) {
    models.getMeta(req, res, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postReview: function (req, res) {
    models.postReview(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send('Your review was successfully posted!');
      }
    })
  },

  addHelpful: function (req, res) {
    models.addHelpful(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send();
      }
    })
  },

  reportReview: function (req, res) {
    models.reportReview(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send();
      }
    })
  }
}