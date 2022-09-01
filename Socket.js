let SaveMessage = require('./utils/SaveMessage')
let UserModel = require('./MongoDB/Schema')
let fetch = require('node-fetch')
let currentUser = null
let currentRoom = null
let MemoryUserList = []


module.exports = (server)=>
{
    let io = require('socket.io')(server)
    io.on("connection", async (socket)=>
    { 
        socket.emit("getUsername", null)

        socket.on("userStatus", (statusObject)=>
        {
            socket.to(statusObject.room).emit("userStatus", {user: statusObject.currentUser, active: statusObject.active})
        })
        
        socket.on("username", async (username)=>
        {
            MemoryUserList.push({id: socket.id, email: username, roomList: []})
            await UserModel.updateOne({_id: username}, {$set: {active: true}})
        })

       
        let room = null


        socket.on("newRoom", async (roomName)=>
        {
            for(let temp of MemoryUserList)
            {
                if(temp.id == socket.id)
                {
                    temp.roomList.push(roomName)
                }
            }
            socket.join(roomName)
            console.log(MemoryUserList)
        })

        socket.on("roomMessage", async (messageProfile)=>
        {
            messageProfile.room = room
            let newMessage = await SaveMessage(messageProfile)
            io.to(room).emit("roomMessage", newMessage)
        })

        socket.on("disconnect", async ()=>
        {
            console.log(socket.id + " has disconnected")
            let newIndex = MemoryUserList.findIndex((temp)=> temp.id == socket.id)
            let response = await UserModel.updateOne({_id: MemoryUserList[newIndex].email}, {$set: {active: false}})
            for(let temp of MemoryUserList[newIndex].roomList)
            {
                socket.to(temp).emit("userStatus", {user: MemoryUserList[newIndex].email, active: false})
            }
            const index = MemoryUserList.findIndex((temp)=>temp.id === socket.id)
            MemoryUserList.splice(index, 1)
        })
    })
}