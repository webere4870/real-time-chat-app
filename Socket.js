let SaveMessage = require('./utils/SaveMessage')
let UserModel = require('./MongoDB/Schema')
let fetch = require('node-fetch')
let currentUser = null


module.exports = (server)=>
{
    let io = require('socket.io')(server)
    io.on("connection", async (socket)=>
    { 
        socket.emit("getUsername", null)
        
        socket.on("username", (username)=>
        {
            currentUser = username
            console.log(currentUser, "user")
            socket.on("disconnect", async ()=>
            {
                console.log(socket.id + " has disconnected")
                
                let response = await UserModel.updateOne({_id: username}, {$set: {active: false}})
            })
        })

       
        let room = null
        console.log(socket.id + " has connected to the server")


        socket.on("newRoom", (roomName)=>
        {
            if(room)
            {
                socket.leave(room)
            }
            console.log(socket.id + " joined " + roomName)
            socket.join(roomName)
            room = roomName
        })

        socket.on("roomMessage", async (messageProfile)=>
        {
            messageProfile.room = room
            let newMessage = await SaveMessage(messageProfile)
            io.to(room).emit("roomMessage", newMessage)
        })
    })
}