const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: true
    },
    owners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    availability: [{}]
})

module.exports = Event = mongoose.model('Event', eventSchema)