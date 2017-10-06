var express = require('express')
var methodOverride = require('method-override')
var app = express()
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('public'))


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ouranimelist');


var Show = mongoose.model('Show', {
  title: String,
  description: String,
  comments: [{words: String, showrating: Number}]
});

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
});


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

// CREATE: make a new comment in an id
app.post('/shows/:id/comments', function (req, res) {
  Show.findByIdAndUpdate(req.params.id,  req.body, function(err, show) {
      show.comments.push(req.body);
      show.save()
      res.redirect('/shows/' + show._id);
  })
})


// DESTROY; remove that show entirely
app.delete('/shows/:id', function (req, res) {
  Show.findByIdAndRemove(req.params.id, function(err) {
    res.redirect('/');
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

// double: either port for heroku or local 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
