// Kitsu is the API
const Kitsu = require('kitsu.js');
const kitsuanime = new Kitsu();
const AnimeComment = require('../models/anime.js')
const User = require('../models/user.js')
// const AniListAPI = require('anilist-api-pt');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
// const anilistApi = new AniListAPI({client_id, client_secret});
const nani = require('nani').init(client_id, client_secret);
// Utilities
const utils = require('./utils')

// Let's add MAL in there just because; not a resource
const Anime = require('malapi').Anime;


module.exports = function(app) {

    app.get('/', (req, res) => {
        let bodytype = utils.checklog("home", req.user)

        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=popularity-desc')
        .then((anime) => {
            res.render('home', {anime, bodytype});
        })
    })

    app.get('/genres', (req, res) => {
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
        let bodytype = utils.checklog("search", req.user)

        nani.get('anime/search/' + req.query.term).then((results) => {
            results.filter(function(result){
                result.description = result.description.replace(/\<br\>/g,"");
            })

            res.render('anime-search', {results, bodytype})
        }).catch((err) => {
            console.log(err)
        })
    })

    // Grab comments, then anime
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
            console.log(data[3])
            let bodytype = utils.checklog("show", req.user)

            res.render("anime-show", {
                anime: data[0][0],  // Kitsuanime data
                anime2: data[1],    // MAL
                anime3: data[2],    // Anilist
                comment: data[3],   // Comments
                bodytype
            })
        }).catch((err) => {
            console.log("Something happened!")
            console.log(err)
        })

    })

    //CREATE; comment for an anime
    app.post('/anime/:id/comments', function (req, res) {
        if(!req.user){
            res.status(400).send()
        }

        let comment = new AnimeComment(req.body)

        User.findById(req.user._id).then((user) => {
            comment.author = user
            console.log(comment)
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
    app.get('/modal/:id', (req, res) => {
        nani.get("anime/"+req.params.id).then((results) => {
            res.render("./partials/anime-summary", {anime: results, layout: false})
        }).catch((err)=>{
            console.log(err)
        })
    })

}
