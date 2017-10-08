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

}
