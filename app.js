// app.js
var exphbs  = require('express-handlebars');
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var mongoose = require('mongoose'), Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ouranimelist');

// var Review = mongoose.model('Review', {
//   reviews: {
//     ratings: Number,
//     description: String
//   }
// });

var Review = mongoose.model('Review', {
    revDescription : String
});


var Show = mongoose.model('Show', {
  title: String,
  description: String,
  reviews: [Review]
});

// Home Page
app.get('/', function (req, res) {
    res.render('home', {});
})

// Show shows
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
// app.put('/shows/:id', function (req, res) {
//     // Show.findById(req.params.id).exec(function (err, show){
//     //     // if (err) return "This is an error!";
//     //     show.reviews.set({description: req.body})
//     //     show.save(function (err, updatedShow){
//     //         // if (err) return "This is an error!";
//     //         res.send(updatedShow)
//     //     })
//     // })
//     // Show.update({phone:request.phone}, {$set: { phone: request.phone }}, {upsert: true}, function(err){...})
//     // Contact.update({phone:request.phone}, {$set: { phone: request.phone }}, {upsert: true}, function(err){...})
//
//     Show.update({ _id: req.params.id }, { reviews: req.body }, {upsert:true});
//     console.log(req.body, req.params.id)
// })

app.post('/shows/:id', function (req, res) {
  Review.create(req.body, function(err, review) {
    res.redirect('/shows/');
    console.log(req.body, show)
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
