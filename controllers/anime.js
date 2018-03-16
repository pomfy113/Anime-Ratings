const malScraper = require('mal-scraper');
// Comments

module.exports = function(app) {
    app.get('/', (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const seasonList = ["winter", "spring", "summer", "fall"];
        const seasonCount = Math.floor(date.getMonth() / 3);

        const season = seasonList[seasonCount];

        malScraper.getSeason(year, season)
          .then((data) => cleanData(data))
          .then((data) => {
                res.render('home/alt-home', {
                    MAL_TV: JSON.stringify(data),
                    season: JSON.stringify({year: year, season: seasonCount})
                });
          }).catch((err) => console.log(err));
    });

    // Change season
    app.get('/season/:season/:year', (req, res) => {
        malScraper.getSeason(req.params.year, req.params.season)
          .then((data) => {
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

             return cleanedData.sort(function(a, b){
                  return b.score - a.score;
              })
          }).then((data) => {
              res.send(JSON.stringify(data));
          }).catch((err) => console.log(err));
    });

    // API
    app.get('/get-current', (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const seasonList = ["winter", "spring", "summer", "fall"];
        const seasonCount = Math.floor(date.getMonth() / 3);

        const season = seasonList[seasonCount];

        malScraper.getSeason(year, season)
          .then((data) => {
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

             return cleanedData.sort(function(a, b){
                  return b.score - a.score;
              })
          }).then((data) => {
              res.send(JSON.stringify(data));
          }).catch((err) => console.log(err));
    });

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

       return cleanedData.sort(function(a, b){
            return b.score - a.score;
        })
    }
}
