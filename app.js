// app.js
var exphbs  = require('express-handlebars');
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ouranimelist');

var reviewSchema = new mongoose.Schema({
    rating: Number,
    summary: String
});

var Review = mongoose.model('Review', reviewSchema);

var ShowSchema = new mongoose.Schema({
    title: { type: String},
    description: {type: String},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
})

var Show = mongoose.model('Show', ShowSchema);

// Home Page
app.get('/', function (req, res) {
    res.render('home', {});
})

// Show shows :^)
app.get('/shows', function (req, res) {
  Show.find(function(err, shows) {
    res.render('shows-index', {shows: shows});
  })
})

// Create show
app.post('/shows', function (req, res) {
  Show.create(req.body, function(err, show) {
    console.log(show);
    res.redirect('/shows/' + show._id);
  })
})

// New review
// app.post('/shows/:id', function (req, res) {
//   Show.reviews.create(req.body, function(err, show) {
//       console.log(show);
//       res.redirect('/shows/' + review._id);
//   })
// })
app.post('/shows/:id', function (req, res) {
    Show.findById(req.params.id).exec(function (err, show) {

        var FirstReview = new Review({
            rating: 5,
            summary: "Test!"
        });
        FirstReview.save(function(err, comment) {
            show.reviews.push(comment);
            show.save();
            res.redirect('/shows/' + show._id);
        });


  })
})

// New show
app.get('/shows/new', function (req, res) {
  res.render('shows-new', {});
})


// Individual show data
app.get('/shows/:id', function (req, res) {
  Show.findById(req.params.id).exec(function (err, show) {
    res.render('shows-data', {show: show});
  })
});




app.listen(3000, function () {
  console.log('Portfolio App listening on port 3000!')
})
