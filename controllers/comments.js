var Show = require('../models/show.js')

module.exports = function(app) {

    // CREATE: make a new comment in an id
    app.post('/shows/:id/comments', function (req, res) {
      Show.findByIdAndUpdate(req.params.id,  req.body, function(err, show) {
          show.comments.push(req.body);
          show.save()
          res.redirect('/shows/' + show._id);
      })
    })

    // DESTROY; delete comment
    app.delete('/shows/:id/:comment_id', function (req, res) {
        Show.findById(req.params.id, function(err, show){
            show.comments.pull({_id: req.params.comment_id})
            show.save()
            res.redirect('/shows/' + show._id);
        })
    })

    //CREATE; first comment for an anime?
    app.post('/anime/:id/', function (req, res) {
      AnimeComment.create(req.body, function(err, acomment) {
        acomment.kitsuId = req.params.id
        res.redirect('/shows/' + show._id);
      })
    })

    app.post('/anime/:id/', function (req, res) {
    AnimeComment.find( { kitsuId: req.params.id },  req.body, function(err, acomment) {
        acomment.comments.push(req.body);
        acomment.save()
        res.redirect('/anime/' + acomment.kitsuId);
    })
  })

}
