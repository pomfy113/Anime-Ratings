// app.js
var exphbs  = require('express-handlebars');
var express = require('express')
var app = express()
var mongoose = require('mongoose');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
mongoose.connect('mongodb://localhost/ouranimelist');

var ReviewSchema = new mongoose.Schema({
  reviews: {
    ratings: Number,
    description: String
  }
});

var shows = mongoose.model('Review', {
  title: String,
  description: String,
  reviews: [ReviewSchema]
});


app.get('/', function (req, res) {
  shows.find(function(err, shows) {
    res.render('home', {shows: shows});
  })
})


app.listen(3000, function () {
  console.log('Portfolio App listening on port 3000!')
})
