let express = require('express')
let ValidateJWT = require("./../utils/ValidateJWT")
let UserModel = require('./../MongoDB/Schema')
let ChatModel = require('./../MongoDB/ChatSchema')
let router = express.Router()



router.get("/users?", async (req, res)=>
{
    let {username} = req.query
    let userList = await UserModel.find({'name': {'$regex': username}}, { _id: 1, name: 1, picture: 1 })
    res.json({userList: userList})
})

router.get("/messages?", ValidateJWT,async (req, res)=>
{
    let {username} = req.query
    let currentUserPicture = req.JWT.picture
    let otherUserPicture = await UserModel.findOne({_id: username})
    
    let chatList = await ChatModel.find({$or: [{to: username, from: req.JWT.email}, {to: req.JWT.email, from: username}]})
    console.log(otherUserPicture, "bre", currentUserPicture)
    res.json({chatList: chatList, [req.JWT.email]: currentUserPicture, [username]: otherUserPicture.picture, current: req.JWT.email, other: otherUserPicture._id, currentName: req.JWT.name, otherName: otherUserPicture.name})
})

router.post("/newMessage", async(req, res)=>
{
    let message = req.body
    
    res.json({success: true})
})

router.get("/changeActivity?", ValidateJWT,async (req, res)=>
{
    let {active} = req.query
    console.log(active)
    if(active == "true")
    {
        let data = await UserModel.updateOne({_id: req.JWT.email}, {$set:{active: true}})

    }
    else
    {
        let data = await UserModel.updateOne({_id: req.JWT.email}, {$set: {active: false}})

    }

    res.json({username: req.JWT.email})
})

router.get("/userList", ValidateJWT, async (req, res)=>
{
    let activityList = await ChatModel.where({to: req.JWT.email}).distinct("room")
    res.json({activityList: activityList, username: req.JWT.email})
})

router.post("/changeActivityServerSide", async (res, req)=>
{
    console.log(req.body)
    if(active == "true")
    {
        let data = await UserModel.updateOne({_id: username}, {$set:{active: true}})

    }
    else
    {
        let data = await UserModel.updateOne({_id: username}, {$set: {active: false}})

    }
})

router.get("/getUsername", ValidateJWT, (req, res)=>
{
    res.json({email: req.JWT.email})
})

router.post("/notifications", ValidateJWT, async (req, res)=>
{
    console.log(req.body)
    res.json({success: true})
})

module.exports = router