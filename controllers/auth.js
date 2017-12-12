const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const utils = require('./utils')


module.exports = function(app) {
    // Register page
    app.get('/register', (req, res) => {
        let bodytype = utils.checklog("home", req.user)
        res.render('register', {bodytype, user: req.user})
    })

    // Actual registry
    app.post('/register', (req, res) => {
        // Create User
        let user = new User(req.body);
        let username = user.username
        let password = user.password
        // Check if it's empty
        if((!username) || (!password)){
            return res.status(400).send('Cannot leave fields empty')
            res.end
        }

        User.findOne({ 'username': username }).then((checkuser) => {
            // Check if user already exists
            if(checkuser){
                return res.status(400).send('Username already exists')
            }
            else{
            // Saving user and jwt token
                user.save(() => {
                    // Else, use jwt to make token and save to cookie, then redirect
                    // NOTE: dotenv required
                    let token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, { expiresIn: "60 days" });
                    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                    res.redirect('/');
                }).catch((err) => {
                    res.send(err.message)
                })
            }
        }).catch((err) => {
            console.log(err, "Something happened while registering")
        })


    });

    // Logout; clears cookies
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    // Login; render the login page
    app.get('/login', (req, res) => {
        let bodytype = utils.checklog("home", req.user)
        res.render('login', {bodytype, user: req.user});
    });

    // LOGIN
    app.post('/login', (req, res) => {
        // Find a user that matches username
        User.findOne({ username: req.body.username }, "+password")
        .then((user) => {
            // If a user does not exist, return error
            if(!user){
                return res.status(401).send({ message: 'Wrong email or password' });
            }
            // Compares password
            user.comparePassword(req.body.password, (err, isMatch) => {
                // If password does not match, return error
                if(!isMatch){
                    return res.status(401).send({ message: 'Wrong email or password' });
                }
                // If it matches, make a cookie
                let token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, { expiresIn: "60 days" });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
                res.redirect('/');
            })
        }).catch((err) => {
            res.send(err.message)
        })
    });

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

}
