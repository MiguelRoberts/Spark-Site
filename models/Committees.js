const mongoose = require('mongoose')
const Schema = mongoose.Schema

const committeSchema = new Schema({
    importance: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = Committee = mongoose.model('Committee', committeeSchema)