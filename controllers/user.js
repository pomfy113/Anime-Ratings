const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const utils = require('./utils')

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const nani = require('nani').init(client_id, client_secret);

const AnimeComment = require('../models/anime.js')


module.exports = function(app) {
    app.get('/anime/:id/favorite', (req, res) => {
        if(req.user){
            User.findOne({ username: req.user.username}).then((user) =>{
                if(user.favorites.includes(req.params.id)){
                    console.log("You already have that favorited!")
                    res.redirect("/anime/"+req.params.id)
                }
                else{
                    user.favorites.unshift(req.params.id)
                    user.save()
                    res.redirect("/anime/"+req.params.id)
                }
            }).catch((err) => {
                console.log(err, "Could not save favorite")
            })

        }
    })
    // User pages!
    app.get('/favorites', (req, res) => {
        if(req.user){
            let bodytype = utils.checklog("favorites", req.user)

            User.findById(req.user._id).then((user) => {
                let favoritedata = user.favorites.map(function(items){
                    return nani.get("anime/"+items)
                })

                Promise.all(favoritedata).then((data) => {
                    console.log(bodytype)
                    res.render("user-favorites", {favorite: data, bodytype, user: req.user})
                })
            })
        }
        else{
            res.render("not-logged", {})
        }
    })

    app.get('/favorites/:id/delete', (req, res) => {
        if(req.user){
            let bodytype = utils.checklog("favorites", req.user)


            User.findById(req.user._id).then((user) => {
                user.favorites.pull(req.params.id)
                user.save()
                let favoritedata = user.favorites.map(function(items){
                    return nani.get("anime/"+items)
                })

                Promise.all(favoritedata).then((data) => {
                    res.render("user-favorites", {favorite: data, bodytype, user: req.user})
                })
            })
        }
        else{
            res.render("not-logged", {})
        }
    })

    // Full profile page
    app.get('/profile', (req, res) => {
        if(req.user){
            User.findById(req.user._id).then((user) => {
                let bodytype = utils.checklog("profile", req.user)
                res.render("user-profile", {bodytype, user: req.user})
            })
        }
        else{
            res.render("not-logged", {})
        }
    })

    app.get('/my-posts', (req, res) => {
        if(req.user){
            User.findById(req.user._id).then((user) => {
                console.log(user)
                AnimeComment.find({author: user._id}).then((comments) => {
                    res.send(comments)
                })
            })
        }
        else{
            res.render("not-logged", {})
        }
    })

    // Delete
    app.delete('/anime/:id/:comment_id', (req, res) => {
        if(req.user){
            AnimeComment.findById(req.params.comment_id).then((comment) => {
                if(comment.author._id.equals(req.user._id)){
                    console.log("Success!")
                    AnimeComment.findByIdAndRemove(req.params.comment_id).then(() =>{
                        res.redirect('/anime/' + req.params.id);
                    })
                }
                else{
                    res.send("Illegal operation!")
                }
            }).catch((err) => {
                console.log(err)
                res.status(500).send()
                return
            })
        }
        else{
            res.render("not-logged", {})

        }
    })

}
