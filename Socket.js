module.exports = (server)=>
{
    let io = require('socket.io')(server)
    io.on("connection", (socket)=>
    {
        let roomName = null
        console.log(socket.id + " has connected to the server")
        socket.on("disconnect", ()=>
        {
            console.log(socket.id + " has disconnected")
        })

        socket.on("newRoom", (roomName)=>
        {
            console.log(socket.id + " joined " + roomName)
            socket.join(roomName)
        })

        socket.on("roomMessage", (messageProfile)=>
        {
            io.to(room).emit("roomMessage", messageProfile)
        })
    })
}