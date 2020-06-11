const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    room: {
        type: String,
        required: true
    },
    
    applicants: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    
    leaders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }]
})

module.exports = Groups = mongoose.model('Groups', groupsSchema)