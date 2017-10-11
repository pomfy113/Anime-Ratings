var mongoose = require('mongoose');

var Show = mongoose.model('Show', {
  title: String,
  description: String,
  comments: [{words: String, showrating: Number}]
});

var AnimeComment = mongoose.model('AnimeComment', {
  title: String,
  comment: String,
  rating: Number
});

module.exports = Show;
