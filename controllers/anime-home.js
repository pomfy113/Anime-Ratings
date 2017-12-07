const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const nani = require('nani').init(client_id, client_secret);
// Utilities
const utils = require('./utils')

module.exports = function(app) {
    // Show for homepage
    app.get('/modal/:id', (req, res) => {
        nani.get("anime/"+req.params.id).then((results) => {
            res.render("./partials/anime-summary", {anime: results, layout: false})
        }).catch((err)=>{
            console.log(err)
        })
    })

    // Sorting home page by popularity
    app.get('/home-sort/popularity', (req, res) => {
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=popularity-desc')
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })

    // Sorting home page by score
    app.get('/home-sort/score', (req, res) => {
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc')
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })

    // Everything airing; usually the default
    app.get('/home-sort/airing-shows', (req, res) => {
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc')
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })

    // Default grabbing date
    app.get('/home-sort/date/:season/:year', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        nani.get(`browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=score-desc`)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })

    app.get('/home-sort/score-date/:season/:year', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        nani.get(`browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=score-desc`)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })

    app.get('/home-sort/popularity-date/:season/:year', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        nani.get(`browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=popularity-desc`)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        })
    })
}
