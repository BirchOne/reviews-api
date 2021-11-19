const {connection} = require('./db.js');

module.exports = {
  getReviews: function (req, res, callback) {
    const {product_id} = req.query;
    const queryString = `select * from reviews where product_id = ${product_id} && reported = ${false} order by helpfulness desc`

    connection.query(queryString, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    })
  },
  getMeta: function (req, res, callback) {
    const {product_id} = req.query;
    const queryString;

    connection.query(queryString, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    })
  },
  postReview: function (req, res) {
    const queryString;
    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },
  addHelpful: function (req, res) {
    const queryString;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },
  reportReview: function (req, res) {
    const queryString;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  }
};