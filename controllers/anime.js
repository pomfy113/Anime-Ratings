const malScraper = require('mal-scraper');
// Comments

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.sendFile('/index.html')
    });

    // Change season
    app.get('/season/:season/:year', (req, res) => {
        malScraper.getSeason(req.params.year, req.params.season)
          .then((data) => cleanData(data)).then((data) => {
              res.send(JSON.stringify(data));
          }).catch((err) => console.log(err));
    });

    // API
    app.get('/get-current', (req, res) => {
        const currentDay = getDate();
        const year = currentDay[0];
        const season = currentDay[1];

        malScraper.getSeason(year, season)
          .then((data) => cleanData(data)).then((data) => {
              res.send(JSON.stringify(data));
          }).catch((err) => console.log(err));
    });

    // For simple fetch
    app.get('/simpleMALscrape', (req, res) =>{
        malScraper.getInfoFromURL(req.query.url).then((data) =>{
            res.send(data);
        }).catch((err) => console.log(err))
    })


    app.get('/search/:name', (req, res) => {
        malScraper.getResultsFromSearch(req.params.name)
            .then((data) => {
                res.send(JSON.stringify(data));
            }).catch((err) => console.log(err));
    })

    // Just cleaning up TV data
    function cleanData(data){
        let cleanedData = data.TV
        let biggerpic;
        // Do some minor altering for the data
        for(let item in cleanedData){
            biggerpic = cleanedData[item].picture.replace('r/167x242/', '');
            cleanedData[item].picture = biggerpic;

            if(cleanedData[item].score === "N/A"){
               cleanedData[item].score = "0"; // I'll need to revert this later
            }
        }
      // Average case
      return cleanedData.sort(function(a, b){
           return b.score - a.score;
       })
   }



    // Get current quarter/season and year for routes
    function getDate(){
        const date = new Date();
        const year = date.getFullYear();
        const seasonList = ["winter", "spring", "summer", "fall"];
        const seasonCount = Math.floor(date.getMonth() / 3);

        const season = seasonList[seasonCount];

        return [year, season, seasonCount]
    }
}
