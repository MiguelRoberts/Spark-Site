const mongoose = require('mongoose')
const Schema = mongoose.Schema

const committeeSchema = new Schema({
    importance: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = Committee = mongoose.model('Committee', committeeSchema)