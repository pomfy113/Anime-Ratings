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
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=popularity-desc')
        .then((anime) => {
            res.render('home', {anime});
        })
    })

    app.get('/genres', function (req, res) {
        nani.get('genre_list').then((anime) => {
            res.send(anime)
        })
    })

    app.get('/test', function (req, res) {
        nani.get('anime/search/Attack+On+Titan').then((anime) => {
            res.send(anime)
        })
    })

    // Search function
    app.get('/search', function (req, res) {
        // kitsuanime.searchAnime(req.query.term)
        //     .then(results => res.render('anime-search', {results: results}))
        //     .catch(err => console.error(err));

        nani.get('anime/search/' + req.query.term).then((results) => {

            results.filter(function(result){
                result.description = result.description.replace(/\<br\>/g,"");
            })

            res.render('anime-search', {results})
        }).catch((err) => {
            console.log(err)
        })
    })

    // Grab comments, then anime
    app.get('/anime/:anime_id', (req, res) => {
        // var comment, MALresults;
        // let comment = AnimeComment.find({ kitsuId : req.params.anime_id }, function(err, acomment){
        //     if(err){
        //         console.log(err, "Could not find anime!")
        //         res.status(500).send()
        //     }
        //     comment = acomment
        // });

        var query = ('anime/' + req.params.anime_id)
        console.log("QUERY", query, "\n\n")

        // Get Anilist data
        let finaldata = nani.get(query).then((results) => {
            let title = results.title_english

            // Promise - grab KitsuAnime data
            kitsuData =
                kitsuanime.searchAnime(title).then((results) => {
                    return new Promise((resolve, reject) => {
                        resolve(results[0])
                    })
                })

            // Promise - grab MAL data
            malData =
                Anime.fromName(title).then((results) => {
                    return new Promise((resolve, reject) => {
                        resolve(results)
                    })
                })

            // With all our Promises combined, we are Captain Render
            return Promise.all([kitsuData, malData, results])
            .then((results) =>{
                // res.send(results)
                // Something funky is going on here
                // The query sends "QUERY anime/style.css" for some reason
                res.render("anime-show", {
                    anime: results[0], // Anilist
                    anime2: results[1], // MAL
                    anime3: results[2] // Anilist
                })
                // console.log("???")

                return results
            }).catch((err) => {
                console.log(err)
                console.log("SOMETHING HAPPENED HERE!")
            })
        }).catch((err) => {
            console.log("Cannot get junk from Anilist!")
            console.log(err)
        })

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

    // Show for homepage
    app.get('/:id', (req, res) => {
        nani.get("anime/"+req.params.id).then((anime) => {
            res.render("home-show", anime)
        })
    })

}
