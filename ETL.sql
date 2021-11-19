LOAD DATA LOCAL INFILE '/Users/jonhi1/Desktop/SDC/reviews-api/csv/characteristics.csv' INTO TABLE reviews.characteristics
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/Users/jonhi1/Desktop/SDC/reviews-api/csv/reviews.csv' INTO TABLE reviews.reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS (id, product_id, rating, @timestamp, summary, body, @recommend, @reported, reviewer_name, reviewer_email, response, helpfulness)
SET
date = FROM_UNIXTIME(@timestamp/1000),
recommend = (@recommend = 'true'),
reported = (@reported = 'true');

LOAD DATA LOCAL INFILE '/Users/jonhi1/Desktop/SDC/reviews-api/csv/characteristic_reviews.csv' INTO TABLE reviews.characteristic
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/Users/jonhi1/Desktop/SDC/reviews-api/csv/reviews_photos.csv' INTO TABLE reviews.photos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;