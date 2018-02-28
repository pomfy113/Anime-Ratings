// Kitsu is one of the APIs for searching
const Kitsu = require('kitsu.js');
const kitsuanime = new Kitsu();
// MAL is another
const Anime = require('malapi').Anime;
// Lastly, we have Anilist; requires client id for use
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const nani = require('nani').init(client_id, client_secret);
const malScraper = require('mal-scraper');
// Comments
const AnimeComment = require('../models/anime.js');
const User = require('../models/user.js');

// Utilities
const utils = require('./utils');


module.exports = function(app) {
    // Getting home
    app.get('/', (req, res) => {
        let bodytype = utils.checklog("home", req.user);
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc&airing_data=true')
        .then((anime) => {
            res.render('home', {anime, bodytype, user: req.user});
        });


    });

    app.get('/about', (req, res) => {
        let bodytype = utils.checklog("about", req.user);
        res.render('about', {bodytype, user: req.user});
    });


    // Getting home
    app.get('/test-home', (req, res) => {
        let bodytype = utils.checklog("home", req.user);
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc&airing_data=true')
        .then((anime) => {
            res.send(anime);
        });
    });
    // Debugging purposes
    app.get('/test-AL', function (req, res) {
        nani.get('anime/21699/page').then((anime) => {
            res.send(anime);
        });
    });

    app.get('/test-new-AL', function (req, res) {
        // nani.get('anime/21699/page').then((anime) => {
        //     res.send(anime);
        // });
        var query = `
        query ($season: MediaSeason) {
          Media (type: ANIME, status: $status) {
            title{
                english
                romaji
            }
          }
        }
        `;

        var variables = {
            season: 'fall 2017'
        };


        var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        fetch(url, options).then(handleResponse)
                           .then(handleData)
                           .catch(handleError);

           function handleResponse(response) {
               return response.json().then(function (json) {
                   return response.ok ? json : Promise.reject(json);
               });
           }

           function handleData(data) {
              res.send(data);
           }

           function handleError(error) {
               console.error(error);
           }
    });

    // Debugging purposes
    app.get('/test-MAL', function (req, res) {
        var test = Anime.fromName("Kono Subarashii Sekai ni Shukufuku wo! 2");
        test.then(newthing => res.send(newthing));
    });

    app.get('/test-MAL-scrape', function (req, res) {
        var test = malScraper.getSeason('2015', 'fall');
        test.then(newthing => res.send(newthing));
    });

    app.get('/test-kitsu', function (req, res) {
        var test = kitsuanime.searchAnime("Konosuba 2");
        // var test = kitsuanime.getAnime('10941')
        test.then(newthing => res.send(newthing));
    });

    app.get('/test-specific', function (req, res) {
        nani.get('anime/100684/page').then((anime) => {
            res.send(anime);
        });
    });

    app.get('/test-pages1', function (req, res) {
        nani.get('browse/anime?status=currently+airing&genres_exclude=hentai&sort=score-desc').then((anime) => {
            res.send(anime[0]);
        });
    });

    app.get('/test-pages2', function (req, res) {
        let cake = nani.get('browse/anime?status=currently+airing&page1');
        let cake2 = nani.get('browse/anime?status=currently+airing&page2');

        Promise.all([cake]).then((cake) => {
            console.log(cake);
            res.send(cake);
        });
    });

// ===================================
// ===================================
// ===================================

    app.get('/alt-home', (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const seasonList = ["winter", "spring", "summer", "fall"];
        const season = seasonList[Math.floor(date.getMonth() / 3)];

        malScraper.getSeason(year, season)
          .then((data) => {
              const animeTV = [];
              for(let item in data.TV){
                  if(data.TV[item].score === "N/A"){
                      data.TV[item].score = "0"; // I'll need to revert this later
                  }
                  animeTV.push(data.TV[item]);
              }

              const sorted = animeTV.sort(function(a, b){
                  return b.score - a.score;
              });

              res.render('home/alt-home', {MAL_TV: animeTV});
          })

          .catch((err) => console.log(err));
    });

    app.get('/test-scraper', (req, res) => {
        const date = new Date();
        const year = date.getFullYear();
        const seasonList = ["winter", "spring", "summer", "fall"];
        const season = seasonList[Math.floor(date.getMonth() / 3)];

        malScraper.getSeason(year, season)
          .then((data) => {
              const anime = [];
              for(let item in data.TV){
                  if(data.TV[item].score === "N/A"){
                      data.TV[item].score = "0"; // I'll need to revert this later
                  }
                  anime.push(data.TV[item]);
              }

              const sorted = anime.sort(function(a, b){
                  return b.score - a.score;
              });

              res.send(sorted);
          })
          .catch((err) => console.log(err));
    });



    // Search function
    // app.get('/search', function (req, res) {
    //     let bodytype = utils.checklog("search", req.user)
    //     // Use AL search
    //     nani.get('anime/search/' + req.query.term).then((results) => {
    //         // Replacing text in description
    //             results.filter(function(result){
    //                 if(result.description){
    //                     result.description = result.description.replace(/\<br\>/g,"");
    //                 }
    //             })
    //         res.render('anime-search', {results, bodytype})
    //     }).catch((err) => {
    //         console.log("Search failure")
    //         console.log(err)
    //         res.render('anime-search-failure', {bodytype, user: req.user})
    //     })
    // })

    // Grab an anime
    app.get('/anime/:anime_id', (req, res) => {
        nani.get(`anime/${req.params.anime_id}/page`).then((ALISTdata) => {
            // Title for grabbing info
            const title = ALISTdata.title_english;
            // Grab data from other sites
            const KITSUdata = kitsuanime.searchAnime(title);
            const MALdata = Anime.fromName(title);
            const comments = AnimeComment.find({ animeId : req.params.anime_id }).then((comments) => {
                    return comments.map(function(item){
                        if(req.user){
                            if(item.author._id.equals(req.user._id)){
                                item.isMine = true;
                            }
                        }
                        return item;
                    });
                });
            return Promise.all([KITSUdata, MALdata, ALISTdata, comments]);
        }).then((data) => {
            let bodytype = utils.checklog("show", req.user);
            res.render("anime-show", {
                KITdata: data[0][0],  // Kitsuanime data
                MALdata: data[1],    // MAL
                ALdata: data[2],    // Anilist
                comment: data[3],   // Comments
                bodytype,
                user: req.user
            });
        }).catch((err) => {
            console.log("Fetch thing");
            console.log(err);
        });

    });

    //CREATE; comment for an anime
    app.post('/anime/:id/comments', (req, res) => {
        if(!req.user){
            res.status(400).send();
        }

        let comment = new AnimeComment(req.body);

        User.findById(req.user._id).then((user) => {
            comment.author = user;
            return comment.save();
        }).then(() => {
            // After finishing, redirect
            res.redirect('/anime/'+ comment.animeId);
        }).catch((err) => {
            console.log(err.message, "Could not save post!");
            res.send(err.message);
        });
    });

    //DELETE; comment for anime
    // app.delete('/anime/:id/:comment_id', (req, res) => {
    //     AnimeComment.findByIdAndRemove(req.params.comment_id, function(err) {
    //         if(err){
    //             console.log(err, "Could not find delete!")
    //             res.status(500).send()
    //             return
    //         }
    //         res.redirect('/anime/' + req.params.id);
    //     })
    // })


};
