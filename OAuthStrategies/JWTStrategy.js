let passport = require('passport')
let JwtStrategy = require('passport-jwt').Strategy
require('dotenv').config()
var opts = {}
opts.jwtFromRequest = function(req) { // tell passport to read JWT from cookies
    var token = null;
    if (req && req.cookies){
        token = req.cookies['jwt']
    }
    return token
}
opts.secretOrKey = process.env.JWT_KEY
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT BASED AUTH GETTING CALLED") // called everytime a protected URL is being served
    console.log(jwt_payload)
    if (CheckUser(jwt_payload.data)) {
        return done(null, jwt_payload.data)
    } else {
        // user account doesnt exists in the DATA
        return done(null, false)
    }
}))

passport.serializeUser(function(user, done) {
    console.log('I should have jack ')
    done(null, user)
})
passport.deserializeUser(function(obj, done) {
    console.log('I wont have jack shit')
    done(null, obj)
})