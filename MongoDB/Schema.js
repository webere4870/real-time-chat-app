let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    _id: String,
    hash: String,
    salt: String
})

module.exports = mongoose.model("UserSchema", UserSchema)