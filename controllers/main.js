let express = require('express')
let router = express.Router()
let ValidateJWT = require('./../utils/ValidateJWT')
let FindOrCreate = require('./../MongoDB/FindOrCreate')
let VerifyUser = require('./../MongoDB/VerifyUser')
let CreateToken = require('./../utils/CreateToken')
let UserModel = require('./../MongoDB/Schema')
let ChatModel = require('./../MongoDB/ChatSchema')
let io = require('socket.io')

function isLoggedIn(req, res, next)
{
    req.user ? next() : res.redirect("/login")
}


router.get("/", isLoggedIn,(req, res)=>
{
    res.redirect("/protected")
})

router.get("/login", (req, res)=>
{
    if(req.user)
    {
        res.redirect("/")
    }
    res.render("login", {error: ""})
})

router.get("/failure", (req, res)=>
{
    res.send("Something went wrong")
})

router.get("/protected", ValidateJWT, (req, res)=>
{
    /*
    let name = req.user.displayName
    let email = req.user.emails[0].value
    let href = req.user._json.picture
    console.log(name, email, href)
    */
    let profile = req.JWT
    res.render("protected", profile)
})

router.get('/logout', function(req, res){
    res.clearCookie("jwt")
    res.redirect("/login")
  });

router.get("/register", (req, res)=>
{
    res.render("register", {error: ""})
})

router.post("/register", async (req, res)=>
{
    let {username, password, name} = req.body
    let insertion = await FindOrCreate(username, password, null, name, "/person-circle.svg")
    if(insertion.accepted == false)
    {
        res.render("register", {error: "User already exists"})  
    }
    else
    {
        res.render("login", {error: ""})
    }
    
})

router.post("/login", async (req, res)=>
{
    let {username, password} = req.body
    VerifyUser(username, password).then((isVerified)=>
    {
        if(isVerified == true)
        {
            let user = {
                displayName: username,
                name: {givenName: username},
                _json: {email: username, picture: "/person-circle.svg"},
                provider: "Node.js Server"}
            let [token, profile] = CreateToken(user)
            res.cookie("jwt", token)
            res.redirect("/chat")
        }
        else
        {
            res.render("login", {error: "Invalid Email or Password"}) 
        }
    })
    .catch((err)=>
    {
        res.redirect("/login", {error: "Invalid Password"})
    })
})

router.get("/chat", ValidateJWT, async (req, res)=>
{
    let notifications = await UserModel.findOne({_id: req.JWT.email})
    let chatList = await ChatModel.where({to: req.JWT.email}).distinct("from")
    let profileObjects = []
    for(let temp of chatList)
    {
        let profile = await UserModel.findOne({_id: temp})
        profileObjects.push(profile)
    }
    console.log("Notifications" , notifications.notifications)
    res.render("chat", {chatList: profileObjects, userObject: req.JWT, notifications: notifications.notifications})
})

module.exports = router