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
        nani.get(query).then((ALISTdata) => {
            // Title for grabbing info
            const title = ALISTdata.title_english
            // Grab data from other sites
            const KITSUdata = kitsuanime.searchAnime(title)
            const MALdata = Anime.fromName(title)
            const comments = AnimeComment.find({ animeId : req.params.anime_id })
            return Promise.all([KITSUdata, MALdata, ALISTdata, comments])
        }).then((data) => {
            res.render("anime-show", {
                anime: data[0][0],  // Kitsuanime data
                anime2: data[1],    // MAL
                anime3: data[2],    // Anilist
                comments: data[3]   // Comments
            })
        }).catch((err) => {
            console.log("Something happened!")
        })

    })

    //CREATE; comment for an anime
    app.post('/anime', function (req, res) {
        if(!user){
            res.status(400).send()
        }
        AnimeComment.create(req.body, () => {
            res.redirect('/anime/' + req.body.animeId);
        }).catch((err) => {
            console.log(err, "Could not post comment!")
            res.status(500).send()
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
            // console.log(results.description)
            // results.description = results.description.replace(/\<br\>/g,"\n");
            // console.log(results.description)
            res.render("./partials/anime-summary", {anime: results, layout: false})
        }).catch((err)=>{
            console.log(err)
        })
    })

}
