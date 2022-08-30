let ChatModel = require('./../MongoDB/ChatSchema')

async function SaveMessage(message)
{
    console.log(message)
    let newMessage = {room: message.room, to: message.to, from: message.from, datetime: new Date().toLocaleString(), message: message.message}
    let added = await ChatModel.create(newMessage)
    let temp = await added.save()
    return newMessage
}

module.exports = SaveMessage