const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FAQSchema = new Schema({
    email: {
        type: String,
        required: true
    }, 

    question: {
        type: String,
        required: true
    },

    answer: {
        type: String
    }
})

module.exports = FAQ = mongoose.model('FAQ', FAQSchema)