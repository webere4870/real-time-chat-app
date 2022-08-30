let ChatModel = require('./../MongoDB/ChatSchema')

async function SaveMessage(message)
{
    let newMessage = {room: message.room, to: message.other, from: message.current, datetime: new Date().toLocaleString(), message: message.message}
    let added = await ChatModel.create(newMessage)
    let temp = await added.save()
    return newMessage
}

module.exports = SaveMessage