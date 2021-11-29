const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
// app.use(express.urlencoded());

const baseUrl = "http://3.133.59.46";

app.get('/', (req, res) => {
  // controllers.getReviews(req, res);
  const { product_id, page, count } = req.query;

  axios
    .get(baseUrl, {
      params: {
        product_id,
        page,
        count,
      },
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(500);
    })
});

app.get('/meta', (req, res) => {
  const {product_id} = req.query

  axios
    .get(`${baseUrl}/meta`, {
      params: {
        product_id,
      },
    })
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(500);
    })
});

app.post('/create', (req, res) => {
  const data = req.body;

  axios({
    method: 'post',
    url: `${baseUrl}/create`,
    data,
  })
  .then((response) => {
    res.status(201).send('Your review was successfully posted!');
  })
  .catch((err) => {
    res.status(500);
  })
});

app.put('/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  axios({
    method: 'put',
    url: `${baseUrl}/${review_id}/helpful`,
  })
  .then((response) => {
    res.status(204).send();
  })
  .catch((err) => {
    res.status(500);
  })
});

app.put('/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  axios({
    method: 'put',
    url: `${baseUrl}/${review_id}/report`,
  })
  .then((response) => {
    res.status(204).send();
  })
  .catch((err) => {
    res.status(500);
  })
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000);
}

module.exports = app;
