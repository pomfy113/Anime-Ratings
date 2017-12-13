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

    // Default grabbing date + sort by score
    app.get('/home-sort/score/:season/:year/:page/genres', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        let page = req.params.page

        let url;
        console.log(season)
        // Let's see if it's airing or not
        // If not, do the season and year normally
        if(req.params.season === 'airing'){
            url = `browse/anime?page=${page}&status=currently+airing&genres_exclude=hentai&sort=score-desc`
        }
        else{
            url = `browse/anime?page=${page}&year=${year}&season=${season}&genres_exclude=hentai&sort=score-desc`
        }

        if(req.query.q){
            url += "&genres=" + req.query.q
        }

        console.log(url)

        nani.get(url)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Custom score + date error")
        })
    })

    // Sort by popularity
    app.get('/home-sort/popularity/:season/:year/:page/genres', (req, res) => {
        let year = req.params.year
        let season = req.params.season
        let url;
        let page = req.params.page


        // Let's see if it's airing or not
        // If not, do the season and year normally
        if(req.params.season === 'airing'){
            url = `browse/anime?page=${page}&status=currently+airing&genres_exclude=hentai&sort=popularity-desc`
        }
        else{
            url = `browse/anime?year=${year}&season=${season}&genres_exclude=hentai&sort=popularity-desc`
        }
        if(req.query.q){
            url += "&genres=" + req.query.q
        }
        console.log(url)

        nani.get(url)
        .then((anime) => {
            res.render('./partials/home-search', {anime, layout: false});
        }).catch((err) => {
            console.log(err, "Custom popularity + date error")
        })
    })
}
