var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();
var mongoose = require('mongoose');


var AnimeComment = mongoose.model('AnimeComment', {
    comment: String,
    rating: Number,
    kitsuId: Number
});


module.exports = function(app) {

    app.get('/search', function (req, res) {
        kitsuanime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));
    })

    //
    app.get('/anime/:anime_id', function (req, res) {
        var comment;
        AnimeComment.find({ kitsuId : req.params.anime_id }, function(err, acomment){
            comment = acomment
        });
        kitsuanime.getAnime(req.params.anime_id)
            .then(results =>
                {res.render('anime-show', {anime: results, comment: comment})
                console.log("BLA BLA console.log thing", comment, "\n\n")})
            .catch(err => console.error(err));
    })

    //CREATE; first comment for an anime?
    app.post('/anime/:id/', function (req, res) {
        AnimeComment.create(req.body, function(err, acomment) {
            console.log(acomment)
            res.redirect('/anime/' + req.params.id);
      })
  })
      app.delete('/anime/:id/:comment_id', function (req, res) {
        AnimeComment.findByIdAndRemove(req.params.comment_id, function(err) {
          res.redirect('/anime/' + req.params.id);
        })
      })

  //   app.post('/anime/:id/', function (req, res) {
  //   AnimeComment.find( { kitsuId: req.params.id },  req.body, function(err, acomment) {
  //       acomment.comments.push(req.body);
  //       acomment.save()
  //       res.redirect('/anime/' + acomment.kitsuId);
  //   })
  // })
}
