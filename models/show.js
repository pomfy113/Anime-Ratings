var mongoose = require('mongoose');

var Show = mongoose.model('Show', {
  title: String,
  description: String,
  comments: [{words: String, showrating: Number}]
});

module.exports = Show;
