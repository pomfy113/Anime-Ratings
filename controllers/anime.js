// Kitsu is one of the APIs for searching
const Kitsu = require('kitsu.js');
const kitsuanime = new Kitsu();
// MAL is another
const Anime = require('malapi').Anime;
// Lastly, we have Anilist; requires client id for use
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const nani = require('nani').init(client_id, client_secret);
// Comments
const AnimeComment = require('../models/anime.js')
const User = require('../models/user.js')

// Utilities
const utils = require('./utils')


module.exports = function(app) {
    // Getting home
    app.get('/', (req, res) => {
        let bodytype = utils.checklog("home", req.user)
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc')
        .then((anime) => {
            res.render('home', {anime, bodytype});
        })
    })
    // Genre check
    app.get('/genres', (req, res) => {
        nani.get('genre_list').then((anime) => {
            res.send(anime)
        })
    })
    // Debugging purposes
    app.get('/test-AL', function (req, res) {
        nani.get('anime/search/Attack+On+Titan').then((anime) => {
            res.send(anime)
        })
    })
    // Debugging purposes
    app.get('/test-MAL', function (req, res) {
        var test = Anime.fromName("Attack on Titan")
        test.then(newthing => res.send(newthing))
    })

    // Search function
    app.get('/search', function (req, res) {
        let bodytype = utils.checklog("search", req.user)
        // Use AL search
        nani.get('anime/search/' + req.query.term).then((results) => {
            // Replacing text in description
                results.filter(function(result){
                    if(result.description){
                        result.description = result.description.replace(/\<br\>/g,"");
                    }
                })
            res.render('anime-search', {results, bodytype})
        }).catch((err) => {
            console.log("Search failure")
            console.log(err)
            res.render('anime-search-failure', {bodytype})
        })
    })

    // Grab and anime
    app.get('/anime/:anime_id', (req, res) => {
        nani.get("anime/" + req.params.anime_id).then((ALISTdata) => {
            // Title for grabbing info
            const title = ALISTdata.title_english
            // Grab data from other sites
            const KITSUdata = kitsuanime.searchAnime(title)
            const MALdata = Anime.fromName(title)
            const comments = AnimeComment.find({ animeId : req.params.anime_id }).then(comments => comments)
            return Promise.all([KITSUdata, MALdata, ALISTdata, comments])
        }).then((data) => {
            let bodytype = utils.checklog("show", req.user)

            res.render("anime-show", {
                anime: data[0][0],  // Kitsuanime data
                anime2: data[1],    // MAL
                anime3: data[2],    // Anilist
                comment: data[3],   // Comments
                bodytype
            })
        }).catch((err) => {
            console.log("Fetch thing")
            console.log(err)
        })

    })

    //CREATE; comment for an anime
    app.post('/anime/:id/comments', (req, res) => {
        if(!req.user){
            res.status(400).send()
        }

        let comment = new AnimeComment(req.body)

        User.findById(req.user._id).then((user) => {
            comment.author = user
            return comment.save()
        }).then(() => {
            // After finishing, redirect
            res.redirect('/anime/'+ comment.animeId)
        }).catch((err) => {
            console.log(err.message, "Could not save post!")
            res.send(err.message)
        })
    })

    //DELETE; comment for anime
    app.delete('/anime/:id/:comment_id', (req, res) => {
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
