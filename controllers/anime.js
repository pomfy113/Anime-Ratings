// Kitsu is the API
var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();
var AnimeComment = require('../models/anime.js')
// const AniListAPI = require('anilist-api-pt');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
// const anilistApi = new AniListAPI({client_id, client_secret});
const nani = require('nani').init(client_id, client_secret);


// Let's add MAL in there just because; not a resource
var Anime = require('malapi').Anime;


module.exports = function(app) {

    app.get('/', function (req, res) {
        res.render('anime-search', {})
    })

    app.get('/test', function (req, res) {
        nani.get('anime/search/Attack+On+Titan').then((anime) => {
            res.send(anime)
        })
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
        AnimeComment.find({ kitsuId : req.params.anime_id }, function(err, acomment){
            if(err){
                console.log(err, "Could not find anime!")
                res.status(500).send()
            }
            comment = acomment
        });

        // Grabbing stats from kitsu, THEN MAL.
        kitsuanime.getAnime(req.params.anime_id)
        .then(results => {
            console.log(results.titles.english)
            let title = results.titles.english
            let malData = Anime.fromName(title)
            let alistData = nani.get('anime/search/'+title)

            // let malscore = malData.statistics.score.value * 10

            Promise.all([results, malData, alistData])
            .then(([results, malData, alistData]) => {

                console.log(alistData);

                let malscore = malData.statistics.score.value * 10

                res.render('anime-show', {
                    anime: results,
                    comment: comment,
                    anime2: malData,
                    anime3: alistData,

                    malscore: malscore
                })
            })

        }).catch(err => {
            console.error(err, "Could not get from Kitsu!")
        });
    })

    //CREATE; comment for an anime
    app.post('/anime', function (req, res) {
        AnimeComment.create(req.body, function(err, acomment) {
            if(err){
                console.log(err, "Could not post comment!")
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
                console.log(err, "Could not find delete!")
                res.status(500).send()
                return
            }
          res.redirect('/anime/' + req.params.id);
        })
      })

}
