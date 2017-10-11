var Show = require('../models/anime.js')
var Kitsu = require('kitsu.js');
var kitsuanime = new Kitsu();


module.exports = function(app) {

    app.get('/search', function (req, res) {
        kitsuanime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));
    })

    //
    app.get('/anime/:anime_id', function (req, res) {
        kitsuanime.getAnime(req.params.anime_id)
            .then(results => res.render('anime-show', {anime: results}))
            .catch(err => console.error(err));
    })

}
