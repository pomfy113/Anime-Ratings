// Kitsu is the API
var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();
var AnimeComment = require('../models/anime.js')


// Let's add MAL in there just because
var Anime = require('malapi').Anime;


module.exports = function(app) {

    app.get('/', function (req, res) {
        res.render('anime-search', {})
    })

    // Search function
    app.get('/search', function (req, res) {
        kitsuanime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));
    })

    // Grab comments, then anime
    app.get('/anime/:anime_id', function (req, res) {
        var comment, MALresults;
        //Comment
        AnimeComment.find({ kitsuId : req.params.anime_id }, function(err, acomment){
            comment = acomment
        });

        // Grabbing stats from kitsu, THEN MAL.
        kitsuanime.getAnime(req.params.anime_id)
            .then(results => {
                Anime.fromName(results.titles.canonical)
                    .then(
                        malstats =>
                        {
                        malscore = malstats.statistics.score.value * 10
                        res.render('anime-show', {
                            anime: results,
                            comment: comment,
                            anime2: malstats,
                            malscore: malscore})

                        })
                })
            .catch(err => console.error(err));
    })

    //CREATE; comment for an anime
    app.post('/anime', function (req, res) {
        AnimeComment.create(req.body, function(err, acomment) {
            if(err){
                res.status(500).send()
                return
            }
            res.redirect('/anime/' + req.body.kitsuId);

      })
  })

    //DELETE; comment for anime
      app.delete('/anime/:id/:comment_id', function (req, res) {
        AnimeComment.findByIdAndRemove(req.params.comment_id, function(err) {
            if(err){
                res.status(500).send()
                return
            }
          res.redirect('/anime/' + req.params.id);
        })
      })

}
