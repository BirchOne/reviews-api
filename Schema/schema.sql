DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

USE reviews;

CREATE TABLE characteristics (
  id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  name VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE reviews (
  id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  rating TINYINT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  summary VARCHAR(50) NOT NULL,
  body VARCHAR(150) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(20) NOT NULL,
  reviewer_email VARCHAR(30) NOT NULL,
  response VARCHAR(150) DEFAULT NULL,
  helpfulness SMALLINT DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE characteristic (
  id INTEGER NOT NULL AUTO_INCREMENT,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value TINYINT DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (characteristic_id)
    REFERENCES characteristics(id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
);

CREATE TABLE photos (
  id INTEGER NOT NULL AUTO_INCREMENT,
  review_id INTEGER NOT NULL,
  url VARCHAR(300),
  PRIMARY KEY (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
);

CREATE INDEX product_id_idx ON reviews (product_id);
CREATE INDEX product_id_idx ON characteristics (product_id);
CREATE INDEX review_id_idx ON photos (review_id);
CREATE INDEX characteristic_id_idx ON characteristic (characteristic_id);

-- INSERT INTO reviews(product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
--   VALUES(2, 5, 'This is a test', 'And I liked it', true, false, 'jonhirak', 'jonhirak@email.com', 'I hope it worked!', 4);