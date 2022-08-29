let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    _id: String,
    hash: String,
    salt: String,
    name: String,
    picture: String,
    provider: String
})

module.exports = mongoose.model("chatschema", UserSchema)