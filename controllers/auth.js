let passport = require('passport')
let express = require('express')
let router = express.Router()
const jwt = require('jsonwebtoken')
const CreateToken = require('./../utils/CreateToken')
const FindOrCreate = require('./../MongoDB/FindOrCreate')
require('dotenv').config()
router.get("/auth/google", passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/auth/facebook", passport.authenticate('facebook', {session: false}))
router.post("/register", (req, res)=>
{
    let {username, password} = req.body
    res.render('login', {error: ""})
})

// Ensure auth was successful
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false}),
  async function(req, res) {
    // Successful authentication, redirect home.

  let [token,profile] = CreateToken(req.user)

    res.cookie("jwt", token)
    res.redirect('/protected');

});


router.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
async function(req, res) {
  let [token,profile] = CreateToken(req.user)


    res.cookie("jwt", token)
    res.redirect('/protected');

});

module.exports = router