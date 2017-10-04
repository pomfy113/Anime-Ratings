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


var Review = mongoose.model('Review', {
  title: String,
  description: String,
  comment: [{words: String, reviewrating: Number}]
});

app.get('/', function (req, res) {
  Review.find(function(err, reviews) {
    res.render('reviews-index', {reviews: reviews});
  })
})

// CREATE; create a new review, then redirect to new review
app.post('/reviews', function (req, res) {
  Review.create(req.body, function(err, review) {
    res.redirect('/reviews/' + review._id);
  })
})


// NEW; gets the new review form
app.get('/reviews/new', function (req, res) {
  res.render('reviews-new', {});
})


// SHOW; gets the id number and shows it
app.get('/reviews/:id', function (req, res) {
  Review.findById(req.params.id).exec(function (err, review) {
    res.render('reviews-show', {review: review});
  })
});


// EDIT; gets the edit form
app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review});
  })
})

//UPDATE; after edit form is complete, this PUTs the new data into the page
app.put('/reviews/:id', function (req, res) {
  Review.findByIdAndUpdate(req.params.id,  req.body, function(err, review) {
    review.comment.push(req.body);
    review.save()
    res.redirect('/reviews/' + review._id);
  })
})


// DELETE; remove that review entirely
app.delete('/reviews/:id', function (req, res) {
  Review.findByIdAndRemove(req.params.id, function(err) {
    res.redirect('/');
  })
})
//
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
