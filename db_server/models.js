/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const { connection } = require('./db');

module.exports = {
  getReviews(req, res, callback) {
    const { product_id } = req.query;
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    let offset = 0;

    if (page > 1) {
      offset = count * (page - 1);
    }

    let queryString = `SELECT * FROM reviews
    WHERE reviews.product_id = ${product_id}
    AND reviews.reported = ${false}
    ORDER BY reviews.helpfulness DESC
    LIMIT ${offset}, ${count}`;

    connection.query(queryString, (err, reviews) => {
      if (err) {
        callback(err);
      } else {
        reviews.forEach((review) => {
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

        queryString = `SELECT photos.id, photos.review_id, photos.url
          FROM photos
          INNER JOIN reviews ON photos.review_id = reviews.id
          WHERE reviews.product_id = ${product_id}`;

        connection.query(queryString, (err, urls) => {
          if (err) {
            callback(err);
          } else {
            urls.forEach((item) => {
              reviews.forEach((review) => {
                if (review.review_id === item.review_id) {
                  delete item.review_id;
                  review.photos.push(item);
                }
              });
            });

            const response = {
              product: product_id,
              page: parseInt(page, 10),
              count: parseInt(count, 10),
              results: reviews,
            };

            callback(null, response);
          }
        });
      }
    });
  },

  getMeta(req, res, callback) {
    const { product_id } = req.query;
    let queryString = `SELECT * FROM reviews
    WHERE reviews.product_id = ${product_id}
    AND reviews.reported = ${false}`;

    function replace(response) {
      Object.keys(response).forEach((key) => {
        // eslint-disable-next-line no-unused-expressions
        typeof response[key] === 'object' ? replace(response[key]) : response[key] = String(response[key]);
      });
    }

    connection.query(queryString, (err, reviews) => {
      if (err) {
        callback(err);
      } else {
        queryString = `SELECT characteristics.name, characteristic.value, characteristics.id FROM characteristics
        INNER JOIN characteristic on characteristics.id = characteristic.characteristic_id
        WHERE characteristics.product_id = ${product_id}`;

        connection.query(queryString, (err, characteristics) => {
          if (err) {
            callback(err);
          } else {
            const response = {
              product_id,
              ratings: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
              },
              recommended: {
                true: 0,
                false: 0,
              },
              characteristics: {},
            };

            reviews.forEach((review) => {
              response.ratings[`${review.rating}`] += 1;
              if (review.recommend === 0) {
                response.recommended.false += 1;
              } else {
                response.recommended.true += 1;
              }
            });

            replace(response);

            const valueTracker = {};

            characteristics.forEach((characteristic) => {
              if (!response.characteristics[characteristic.name]) {
                response.characteristics[characteristic.name] = {
                  id: characteristic.id,
                };
              }

              if (!valueTracker[characteristic.name]) {
                valueTracker[characteristic.name] = {
                  count: 0,
                  sum: 0,
                };
              }

              valueTracker[characteristic.name].count += 1;
              valueTracker[characteristic.name].sum += characteristic.value;
            });

            // eslint-disable-next-line guard-for-in
            for (const key in valueTracker) {
              const avg = valueTracker[key].sum / valueTracker[key].count;
              response.characteristics[key].value = `${avg}`;
            }

            callback(null, response);
          }
        });
      }
    });
  },

  postReview(req, res, callback) {
    const {
      product_id, rating, recommend, photos, characteristics
    } = req.body;
    let { summary, body, name, email } = req.body;

    summary = summary.replace(/'/g, "\\'");
    body = body.replace(/'/g, "\\'");
    name = name.replace(/'/g, "\\'");
    email = email.replace(/'/g, "\\'");

    let queryString = `INSERT INTO
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
              const constructCharQuery = function (characteristics) {
                const values = [];
                // eslint-disable-next-line guard-for-in
                for (const key in characteristics) {
                  values.push(`(${key}, ${review_id}, ${characteristics[key]})`);
                }
                return values.join(',');
              };
              queryString = `INSERT INTO characteristic (characteristic_id, review_id, value)
                VALUES${constructCharQuery(characteristics)}`;

              connection.query(queryString, (err) => {
                if (err) {
                  callback(err);
                } else if (photos.length > 0) {
                  const constructPhotosQuery = function (photos) {
                    const values = [];
                    photos.forEach((url) => {
                      values.push(`(${review_id}, '${url}')`);
                    });
                    return values.join(',');
                  };

                  const value = constructPhotosQuery(photos);

                  queryString = `INSERT INTO
                    photos (review_id, url)
                    VALUES ${value}`;

                  connection.query(queryString, (err) => {
                    if (err) {
                      callback(err);
                    } else {
                      callback();
                    }
                  });
                } else {
                  callback();
                }
              });
            } else if (photos.length > 0) {
              const constructPhotosQuery = function (photos) {
                const values = [];
                photos.forEach((url) => {
                  values.push(`(${review_id}, '${url}')`);
                });
                return values.join(',');
              };

              const value = constructPhotosQuery(photos);

              queryString = `INSERT INTO
                photos (review_id, url)
                VALUES ${value}`;

              connection.query(queryString, (err) => {
                if (err) {
                  callback(err);
                } else {
                  callback();
                }
              });
            } else {
              callback();
            }
          }
        });
      }
    });
  },

  addHelpful(req, res, callback) {
    const { review_id } = req.params;
    const queryString = `UPDATE reviews
      SET helpfulness = helpfulness + 1
      WHERE id = ${review_id}`;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  },

  reportReview(req, res, callback) {
    const { review_id } = req.params;
    const queryString = `UPDATE reviews
      SET reported = true
      WHERE id = ${review_id}`;

    connection.query(queryString, (err) => {
      if (err) {
        callback(err);
      } else {
        callback();
      }
    });
  },
};
