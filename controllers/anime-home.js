const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const nani = require('nani').init(client_id, client_secret);
// Utilities
const utils = require('./utils')

// YES, THIS NEEDS ITS OWN JS
module.exports = function(app) {
    // Show for homepage
    app.get('/modal/:id', (req, res) => {
        let sequel, prequel;
        nani.get("anime/"+req.params.id+"/page").then((results) => {
            for(x in results.relations){
                if(results.relations[x].relation_type === "prequel"){
                    prequel = results.relations[x]
                }
                if(results.relations[x].relation_type === "sequel"){
                    sequel = results.relations[x]
                }
            }

            res.render("./partials/anime-summary", {anime: results, sequel, prequel, layout: false})
        }).catch((err)=>{
            console.log(err)
        })
    })

    // Sorting home page by popularity
    app.get('/home-sort/popularity/genres', (req, res) => {
        let url = 'browse/anime?status=currently+airing&genres_exclude=hentai&sort=popularity-desc'
        // If you have a genre filter on, add it to the genre
        if(req.query.q){
            url += "&genres=" + req.query.q
        }
        nani.get(url)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Pop sort error")
        })
    })

    // Score sort
    app.get('/home-sort/score/genres', (req, res) => {
        let url = 'browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc'
        // If you have a genre filter on, add it to the genre
        if(req.query.q){
            url += "&genres=" + req.query.q
        }
        nani.get(url)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Score sort error")
        })
    })

    // Everything airing; usually the default
    // app.get('/home-sort/airing-shows', (req, res) => {
    //     let url = "browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc"
    //     nani.get(url)
    //     .then((anime) => {
    //         res.render('./partials/home-search', {anime});
    //     }).catch((err) => {
    //         console.log(err, "Airing data error")
    //     })
    // })

    // Default grabbing date + sort by score
    app.get('/home-sort/score-date/:season/:year/genres', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        let url = `browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=score-desc`
        if(req.query.q){
            url += "&genres=" + req.query.q
        }
        nani.get(url)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Custom date error")
        })
    })

    // Sort by popularity
    app.get('/home-sort/popularity-date/:season/:year/genres', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        nani.get(`browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=popularity-desc`)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Custom date - popularity error")
        })
    })
}
