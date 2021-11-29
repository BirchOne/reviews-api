const request = require('supertest');
const app = require('./index');
const {connection} = require('./db');

beforeAll(done => {
  done()
})

afterAll(done => {
  connection.close()
  done()
})

it('Testing to see if Jest works', () => {
  expect(1).toBe(1)
});

describe('Get request to "/" endpoint', () => {
  it('Should return reviews for a given product', async () => {
    const res = await request(app)
      .get('/')
      .query({
        product_id: 2
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should return reviews for a given product given a count parameter', async () => {
    const res = await request(app)
      .get('/')
      .query({
        product_id: 2,
        count: 10
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should return reviews for a given product given a page parameter', async () => {
    const res = await request(app)
      .get('/')
      .query({
        product_id: 2,
        page: 2
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should not return any reviews without a product_id parameter', async () => {
    const res = await request(app)
      .get('/')
      .query({
        count: 3,
        page: 2
      })
    expect(res.statusCode).toEqual(500)
  })
})

describe('Get request to "/meta" endpoint', () => {
  it('Should return metadata for a given product', async () => {
    const res = await request(app)
      .get('/meta')
      .query({
        product_id: 2
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should return metadata for a given product given a count parameter', async () => {
    const res = await request(app)
      .get('/meta')
      .query({
        product_id: 2,
        count: 10
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should return metadata for a given product given a page parameter', async () => {
    const res = await request(app)
      .get('/meta')
      .query({
        product_id: 2,
        page: 2
      })
    expect(res.statusCode).toEqual(200)
  })

  it('Should not return any metadata without a product_id parameter', async () => {
    const res = await request(app)
      .get('/meta')
      .query({
        count: 3,
        page: 2
      })
    expect(res.statusCode).toEqual(500)
  })
})

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/create')
      .send({
        product_id: 2,
        rating: 3,
        summary: 'This is a test',
        body: 'I really hope this works!',
        recommend: true,
        name: 'tester',
        email: 'tester123@email.com',
        photos: [],
        characteristics: {"5": 2},
      })
    expect(res.statusCode).toEqual(201)
  })
})