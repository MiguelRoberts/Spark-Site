const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const applicantSchema = new Schema({
    written: {
        grades: [], // category grades
        comments: String
    },
    individual_interview: {
        questions: [],
        questionGrades: [],
        grades: [], // category grades
        comments: String
    },
    group_interview: {
        grades: [], // category grades
        comment: String
    }
})