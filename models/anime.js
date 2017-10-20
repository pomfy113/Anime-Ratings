var Kitsu = require('kitsu.js');
var anime = new Kitsu();
var mongoose = require('mongoose');


var AnimeComment = mongoose.model('AnimeComment', {
    comment: String,
    rating: Number,
    kitsuId: Number
});

module.exports = AnimeComment;
