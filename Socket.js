let SaveMessage = require('./utils/SaveMessage')

module.exports = (server)=>
{
    let io = require('socket.io')(server)
    io.on("connection", (socket)=>
    {
        let room = null
        console.log(socket.id + " has connected to the server")
        socket.on("disconnect", ()=>
        {
            console.log(socket.id + " has disconnected")
        })

        socket.on("newRoom", (roomName)=>
        {
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