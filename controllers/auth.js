const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const utils = require('./utils')


module.exports = function(app) {

    app.get('/register', (req, res) => {
        res.render('register', {})
    })

    app.post('/register', (req, res) => {
        // Create User
        let user = new User(req.body);
        let username = user.username
        let password = user.password

        if((!username) || (!password)){
            return res.status(400).send('Cannot leave fields empty')
            res.end
        }

        User.findOne({ 'username': username }).then((user) => {
            if(user){
                return res.status(400).send('Username already exists')
            }
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
        }).catch((err) => {
            console.log("Something happened here")
        })


    });

    // Logout; clears cookies
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    });

    // Login; render the login page
    app.get('/login', (req, res) => {
        res.render('login');
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

}
