const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    academy: {
        type: String,
        required: true
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