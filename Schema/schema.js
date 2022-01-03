const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  _id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  recommended: {
    true: Number,
    false: Number,
  },
});

const CharacteristicSchema = mongoose.Schema({
  _id: Number,
  type: String,
  value: Number,
  product: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const ReviewSchema = mongoose.Schema({
  _id: Number,
  date: Date,
  rating: Number,
  recommend: Boolean,
  summary: String,
  body: String,
  reviewer_name: String,
  response: String,
  email: String,
  helpfulness: Number,
  reported: Boolean,
  product: [{type: Schema.Types.ObjectId, ref: 'Product'}]
});

const PhotoSchema = mongoose.Schema({
  _id: Number,
  url: String,
  review: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

const Product = mongoose.model('Product', ProductSchema);
const Characteristic = mongoose.model('Characteristic', CharacteristicSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Photo = mongoose.model('Photo', PhotoSchema);