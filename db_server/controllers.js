const models = require('./models');

module.exports = {
  getReviews(req, res) {
    models.getReviews(req, res, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  getMeta(req, res) {
    models.getMeta(req, res, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postReview(req, res) {
    models.postReview(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send('Your review was successfully posted!');
      }
    });
  },

  addHelpful(req, res) {
    models.addHelpful(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send();
      }
    });
  },

  reportReview(req, res) {
    models.reportReview(req, res, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(204).send();
      }
    });
  },
};
