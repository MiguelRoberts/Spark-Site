const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaderSchema = new Schema({
    activities: [String],
    committees: [String],
    headshot: String
})

module.exports = Leader = mongoose.model('Leader', leaderSchema)