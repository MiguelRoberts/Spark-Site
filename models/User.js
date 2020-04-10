const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },  
    grade: {
        type: String,
    },
    academy: {
        type: String,
    },
    leader_data: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Leader'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = User = mongoose.model('User', userSchema)