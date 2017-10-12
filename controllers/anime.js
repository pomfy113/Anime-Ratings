var AnimeComment = require('../models/show.js')
var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();


module.exports = function(app) {

    app.get('/search', function (req, res) {
        var searchResults;
        kitsuanime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {show: results}))
            .catch(err => console.error(err));
    })

    //
    app.get('/anime/:anime_id', function (req, res) {
        var animeStats

        kitsuanime.getAnime(req.params.anime_id)
            .then(results => {
                animeStats = results;
                AnimeComment.find( { kitsuId: req.params.id },  req.body, function(err, acomment){
                    res.render('anime-show', {anime: animeStats, comments: acomment })
                })
            })
            .catch(err => console.error(err));
    })

    //CREATE; first comment for an anime?
    app.post('/anime/:id/', function (req, res) {
      AnimeComment.create(req.body, function(err, acomment) {
        acomment.kitsuId = req.params.id
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
