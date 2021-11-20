const {connection} = require('./db.js');

module.exports = {
  getReviews: function (req, res, callback) {
    let {product_id, page, count, sort} = req.query;
    let offset = 0;

    if (!count) {
      count = 5;
    }
    if (page > 1) {
      offset = count * (page -1);
    }

    // let queryString;


    let queryString = `select * from reviews where reviews.product_id = ${product_id} AND reviews.reported = ${false} order by reviews.helpfulness desc limit ${offset}, ${count}`

    connection.query(queryString, (err, reviews) => {
      if (err) {
        callback(err);
      } else {

        reviews.forEach(review => {
          review.photos = [];
          if (review.response === 'null') {
            review.response = null;
          }
          if (review.recommend === 0) {
            review.recommend = false;
          } else {
            review.recommend = true;
          }
          review.review_id = review.id;
          delete review.id;
          delete review.reported;
          delete review.product_id;
          delete review.reviewer_email;
        });

        queryString = `select photos.id, photos.review_id, photos.url from photos inner join reviews on photos.review_id = reviews.id where reviews.product_id = ${product_id}`

        connection.query(queryString, (err, urls) => {
          if (err) {
            callback(err);
          } else {
            urls.forEach(item => {
              reviews.forEach(review => {
                if (review.review_id === item.review_id) {
                  delete item.review_id;
                  review.photos.push(item);
                }
              })
            })

            let response = {
              product: product_id,
              page: parseInt(page),
              count: parseInt(count),
              results: reviews
            }

            callback(null, response)
          }
        })
      }
    })
  },
  getMeta: function (req, res, callback) {
    const {product_id} = req.query;
    const queryString = '';

    connection.query(queryString, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results);
      }
    })
  },
  postReview: function (req, res) {
    const queryString = '';
    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },
  addHelpful: function (req, res) {
    const queryString = '';

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },
  reportReview: function (req, res) {
    const queryString = '';

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  }
};