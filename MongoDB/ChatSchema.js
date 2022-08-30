let mongoose = require('mongoose')
let ChatSchema = new mongoose.Schema({
    to: String,
    from: String,
    datetime: Date,
    message: String
})

module.exports = mongoose.model("ChatSchema", ChatSchema)