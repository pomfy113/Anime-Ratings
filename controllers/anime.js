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
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc&airing_data=true')
        .then((anime) => {
            res.render('home', {anime, bodytype, user: req.user});
        })
    })
    // Genre check
    app.get('/genres', (req, res) => {
        nani.get('genre_list').then((anime) => {
            res.send(anime)
        })
    })
    // Getting home
    app.get('/test-home', (req, res) => {
        let bodytype = utils.checklog("home", req.user)
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc&airing_data=true')
        .then((anime) => {

            res.send(anime)
        })
    })
    // Debugging purposes
    app.get('/test-AL', function (req, res) {
        nani.get('anime/21699/page').then((anime) => {
            res.send(anime)
        })
    })
    // Debugging purposes
    app.get('/test-MAL', function (req, res) {
        var test = Anime.fromName("Kono Subarashii Sekai ni Shukufuku wo! 2")
        test.then(newthing => res.send(newthing))
    })

    app.get('/test-kitsu', function (req, res) {
        var test = kitsuanime.searchAnime("Konosuba 2")
        // var test = kitsuanime.getAnime('10941')

        test.then(newthing => res.send(newthing))
    })

    app.get('/test-specific', function (req, res) {
        nani.get('anime/100684/page').then((anime) => {
            res.send(anime)
        })
    })

    app.get('/test-pages1', function (req, res) {
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc').then((anime) => {
            res.send(anime[0])
        })
    })

    app.get('/test-pages2', function (req, res) {
        let cake = nani.get('browse/anime?status=currently+airing&page1');
        let cake2 = nani.get('browse/anime?status=currently+airing&page2');

        Promise.all([cake]).then((cake) => {
            console.log(cake)
            res.send(cake)
        })
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
            res.render('anime-search-failure', {bodytype, user: req.user})
        })
    })

    // Grab an anime
    app.get('/anime/:anime_id', (req, res) => {
        nani.get(`anime/${req.params.anime_id}/page`).then((ALISTdata) => {
            // Title for grabbing info
            const title = ALISTdata.title_english
            // Grab data from other sites
            const KITSUdata = kitsuanime.searchAnime(title)
            const MALdata = Anime.fromName(title)
            const comments = AnimeComment.find({ animeId : req.params.anime_id }).then((comments) => {
                    return comments.map(function(item){
                        if(req.user){
                            if(item.author._id.equals(req.user._id)){
                                item.isMine = true;
                            }
                        }
                        return item
                    })

                })
            return Promise.all([KITSUdata, MALdata, ALISTdata, comments])
        }).then((data) => {
            let bodytype = utils.checklog("show", req.user)
            console.log(data[3])

            res.render("anime-show", {
                KITdata: data[0][0],  // Kitsuanime data
                MALdata: data[1],    // MAL
                ALdata: data[2],    // Anilist
                comment: data[3],   // Comments
                bodytype,
                user: req.user
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
    // app.delete('/anime/:id/:comment_id', (req, res) => {
    //     AnimeComment.findByIdAndRemove(req.params.comment_id, function(err) {
    //         if(err){
    //             console.log(err, "Could not find delete!")
    //             res.status(500).send()
    //             return
    //         }
    //         res.redirect('/anime/' + req.params.id);
    //     })
    // })


}
