const express = require('express')
const exphbs  = require('express-handlebars');
// Parsing bodies
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
// Used for authentication
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// Mongoose
const mongoose = require('mongoose');

require('dotenv').config()
const app = express()

const moment = require('moment');



// MIDDLEWARE
// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
// Method override
app.use(methodOverride('_method'))
// Public
app.use(express.static('public'))
// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Cookie parser
app.use(cookieParser());

// Database
// mongoose.Promise = global.Promise
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ouranimelist', {useMongoClient: true});

// // Authorization
let checkAuth = (req, res, next) => {
  // If there's a cookie, they should be logged in
  if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
    req.user = null;
  } else {
    // Success! Decode the token, then put that payload into req.user
    let token = req.cookies.nToken;
    let decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log("User currently logged in", req.user.username)
  }
  next()
}

//

// // Run checkAuth
app.use(checkAuth)

// Anime routes
require('./controllers/anime.js')(app);
// This needs its own; lot of work happening at home
require('./controllers/anime-home.js')(app);
// Authentication
require('./controllers/auth.js')(app);
require('./controllers/user.js')(app);


// double: either port for heroku or local 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
