const mongoose = require('mongoose')
const Schema = mongoose.Schema

const applicationDetailsSchema = new Schema({
    written: {
        instructions: String,
        questions: [], // written questions
        categories: [], // categories to be graded on
        deadline: String
    },
    individual_interview: {
        questions: [], // pool of all questions that can be asked in the interview
        categories: [] // categories to be graded on
    },
    group_interview: {
        categories: [] // categories to be graded on
    }
})

module.exports = ApplicationDetails = mongoose.model('ApplicationDetails', applicationDetailsSchema)