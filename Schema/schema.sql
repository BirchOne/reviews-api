DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

USE reviews;

CREATE TABLE products (
  id INTEGER NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id)
);

CREATE TABLE characteristics (
  id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  name VARCHAR(10) NOT NULL,
  value DECIMAL(10, 5) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
    REFERENCES products(id)
);

CREATE TABLE reviews (
  id INTEGER NOT NULL AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  summary VARCHAR(50) NOT NULL,
  body VARCHAR(150) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(20) NOT NULL,
  reviewer_email VARCHAR(30) NOT NULL,
  rating TINYINT NOT NULL,
  response VARCHAR(150),
  helpfulness SMALLINT DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
    REFERENCES products(id)
);

CREATE TABLE photos (
  id INTEGER NOT NULL AUTO_INCREMENT,
  review_id INTEGER NOT NULL,
  url VARCHAR(300),
  PRIMARY KEY (id),
  FOREIGN KEY (review_id)
    REFERENCES reviews(id)
);

-- CREATE TABLE ratings (
--   id INTEGER NOT NULL AUTO_INCREMENT,
--   product_id INTEGER NOT NULL,
--   `1` SMALLINT DEFAULT 0,
--   `2` SMALLINT DEFAULT 0,
--   `3` SMALLINT DEFAULT 0,
--   `4` SMALLINT DEFAULT 0,
--   `5` SMALLINT DEFAULT 0,
--   PRIMARY KEY (id),
--   FOREIGN KEY (product_id)
--     REFERENCES products(id)
-- );

-- CREATE TABLE recommended (
--   id INTEGER NOT NULL AUTO_INCREMENT,
--   product_id INTEGER NOT NULL,
--   `true` SMALLINT DEFAULT 0,
--   `false` SMALLINT DEFAULT 0,
--   PRIMARY KEY (id),
--   FOREIGN KEY (product_id)
--     REFERENCES products(id)
-- );