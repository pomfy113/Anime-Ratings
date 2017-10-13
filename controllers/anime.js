// Kitsu is the API
var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();

var mongoose = require('mongoose');

//Move this to seperate model later
var AnimeComment = mongoose.model('AnimeComment', {
    comment: String,
    rating: Number,
    kitsuId: Number
});


module.exports = function(app) {

    // Search function
    app.get('/search', function (req, res) {
        kitsuanime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));
    })

    // Grab comments, then anime
    app.get('/anime/:anime_id', function (req, res) {
        var comment;
        AnimeComment.find({ kitsuId : req.params.anime_id }, function(err, acomment){
            comment = acomment
        });
        kitsuanime.getAnime(req.params.anime_id)
            .then(results => res.render('anime-show', {anime: results, comment: comment}))
            .catch(err => console.error(err));
    })

    //CREATE; comment for an anime
    app.post('/anime/:id/', function (req, res) {
        AnimeComment.create(req.body, function(err, acomment) {
            res.redirect('/anime/' + req.params.id);
      })
  })

    //DELETE; comment for anime
      app.delete('/anime/:id/:comment_id', function (req, res) {
        AnimeComment.findByIdAndRemove(req.params.comment_id, function(err) {
          res.redirect('/anime/' + req.params.id);
        })
      })

}
