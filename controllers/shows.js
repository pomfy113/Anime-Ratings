var Show = require('../models/show.js')

module.exports = function(app) {

    app.get('/', function (req, res) {
      Show.find(function(err, shows) {
        res.render('shows-index', {shows: shows});
      })
    })

    // CREATE; create a new show, then redirect to new show
    app.post('/shows', function (req, res) {
      Show.create(req.body, function(err, show) {
        res.redirect('/shows/' + show._id);
      })
    })

    // NEW; gets the new show form
    app.get('/shows/new', function (req, res) {
      res.render('shows-new', {});
    })


    // SHOW; gets the id number of show and shows it
    app.get('/shows/:id', function (req, res) {
      Show.findById(req.params.id).exec(function (err, show) {
        res.render('shows-show', {show: show});
      })
    })


    // EDIT; gets the edit form
    app.get('/shows/:id/edit', function (req, res) {
      Show.findById(req.params.id, function(err, show) {
        res.render('shows-edit', {show: show});
      })
    })

    // UPDATE; after edit form is complete, this PUTs the new data into the page
    app.put('/shows/:id', function (req, res) {
      Show.findByIdAndUpdate(req.params.id,  req.body, function(err, show) {
        res.redirect('/shows/' + show._id);
      })
    })

    // DESTROY; remove that show entirely
    app.delete('/shows/:id', function (req, res) {
      Show.findByIdAndRemove(req.params.id, function(err) {
        res.redirect('/');
      })
    })

}
