let express = require('express')
let passport = require('passport')
let app = express()
let session = require('express-session')
let pageRouter = require('./controllers/main')
let authRouter = require('./controllers/auth')
let chatRouter = require('./controllers/chat')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let path = require('path')
let mongoose = require('mongoose')
let http = require('http')
let io = require('socket.io')
require('./utils/userData')
require('./MongoDB/Mongo')
let server = http.createServer(app)
require('./Socket')(server)



require('./OAuthStrategies/GoogleStrategy')
require('./OAuthStrategies/FacebookStrategy')
require('./OAuthStrategies/JWTStrategy')
require('dotenv').config()
const config = {secretOrKey:"mysecret"}


let MongoStore = require('connect-mongodb-session')(session)
// let store = new MongoStore({
//     uri: 'mongodb://localhost:27017/test',
//     collection: 'OIDCSessions'
// });


app.use(cookieParser())
app.use(express.static('public'))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//app.set('layout', './views/layouts/main')
//app.use(expressLayouts)

/*
app.use(session({
    saveUninitialized: true,
    resave: false,
    store: store,
    secret: process.env.SESSION_SECRET
}))*/

app.use(passport.initialize())
//app.use(passport.session())


app.use("/", pageRouter)
app.use("/", authRouter)
app.use("/", chatRouter)

server.listen(process.env.PORT || 3000, ()=>
{
    console.log("Listening on port 3000")
})

