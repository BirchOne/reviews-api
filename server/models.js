const {connection} = require('./db.js');

module.exports = {
  getReviews: function (req, res, callback) {
    let {product_id, page, count, sort} = req.query;
    let offset = 0;

    if (!count) {
      count = 5;
    }
    if (!page) {
      page = 1;
    }
    if (page > 1) {
      offset = count * (page -1);
    }

    let queryString =
    `SELECT * FROM reviews
    WHERE reviews.product_id = ${product_id}
    AND reviews.reported = ${false}
    ORDER BY reviews.helpfulness DESC
    LIMIT ${offset}, ${count}`;

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

        queryString =
          `SELECT photos.id, photos.review_id, photos.url
          FROM photos
          INNER JOIN reviews ON photos.review_id = reviews.id
          WHERE reviews.product_id = ${product_id}`;

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
    let queryString =
    `SELECT * FROM reviews
    WHERE reviews.product_id = ${product_id}
    AND reviews.reported = ${false}`;

    connection.query(queryString, (err, reviews) => {
      if (err) {
        callback(err);
      } else {
        queryString =
        `SELECT characteristics.name, characteristic.value, characteristics.id FROM characteristics
        INNER JOIN characteristic on characteristics.id = characteristic.characteristic_id
        WHERE characteristics.product_id = ${product_id}`;


        connection.query(queryString, (err, characteristics) => {
          if (err) {
            callback(err);
          } else {
            let response = {
              product_id,
              ratings: {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
              },
              recommended: {
                'true': 0,
                'false': 0,
              },
              // characteristics = {},
            }

            callback(null, response);
          }
        })
      }
    })
  },

  postReview: function (req, res, callback) {
    const {product_id, rating, summary, body, recommend, name, email} = req.query;
    let photos = JSON.parse(req.query.photos);
    // console.log(req.query.characteristics)
    let characteristics = JSON.parse(req.query.characteristics);

    let queryString =
      `INSERT INTO
      reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES (${product_id}, ${rating}, '${summary}', '${body}', ${recommend}, '${name}', '${email}')`;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        queryString = 'SELECT LAST_INSERT_ID()';
        connection.query(queryString, (err, review_id) => {
          if (err) {
            callback(err);
          } else {
            review_id = review_id[0]['LAST_INSERT_ID()'];
            if (Object.keys(characteristics).length > 0) {
              const constructCharQuery = function(characteristics) {
                let values = [];
                for (let key in characteristics) {
                  values.push(`(${key}, ${review_id}, ${characteristics[key]})`)
                }
                return values.join(',');
              }
              queryString =
                `INSERT INTO characteristic (characteristic_id, review_id, value)
                VALUES` + constructCharQuery(characteristics);

              connection.query(queryString, (err) => {
                if (err) {
                  callback(err);
                } else {
                  if(photos.length > 0) {
                    const constructPhotosQuery = function (photos) {
                      let values = [];
                      photos.forEach(url => {
                        values.push(`(${review_id}, '${url}')`);
                      });
                      return values.join(',');
                    };

                    const value = constructPhotosQuery(photos)

                    queryString =
                    `INSERT INTO
                    photos (review_id, url)
                    VALUES ${value}`;

                    connection.query(queryString, (err) => {
                      if (err) {
                        callback(err);
                      } else {
                        callback();
                      }
                    })
                  } else {
                    callback();
                  }
                }
              })
            } else {
              if(photos.length > 0) {
                const constructPhotosQuery = function (photos) {
                  let values = [];
                  photos.forEach(url => {
                    values.push(`(${review_id}, '${url}')`);
                  });
                  return values.join(',');
                };

                const value = constructPhotosQuery(photos)

                queryString =
                `INSERT INTO
                photos (review_id, url)
                VALUES ${value}`;

                connection.query(queryString, (err) => {
                  if (err) {
                    callback(err);
                  } else {
                    callback();
                  }
                })
              } else {
                callback();
              }
            }
          }
        })
      }
    })
  },

  addHelpful: function (req, res, callback) {
    const {review_id} = req.params;
    const queryString =
      `UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE id = ${review_id}`;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  },

  reportReview: function (req, res, callback) {
    const {review_id} = req.params;
    const queryString =
      `UPDATE reviews
      SET reported = true
      WHERE id = ${review_id}`;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    })
  }
};