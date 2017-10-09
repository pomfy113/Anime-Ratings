var Show = require('../models/anime.js')
var Kitsu = require('kitsu.js');
var anime = new Kitsu();


module.exports = function(app) {

    app.get('/search/:id', function (req, res) {
        anime.searchAnime(req.params.id)
            .then(results => res.render('anime-search', {results: results}))
            .catch(err => console.error(err));
            
    })



}
