var Show = require('../models/anime.js')
var Kitsu = require('kitsu.js');
var anime = new Kitsu();


module.exports = function(app) {

    app.get('/search', function (req, res) {
        anime.searchAnime(req.query.term)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));

    })



}
