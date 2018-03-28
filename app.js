const express = require('express')
// Parsing bodies
const app = express()
const moment = require('moment');

// Public
app.use(express.static('public/build'))

// Anime routes
require('./controllers/anime.js')(app);

// double: either port for heroku or local 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
