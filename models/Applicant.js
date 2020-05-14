const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const applicantSchema = new Schema({
    written: {
        activities: [],
        responses: [],
        grades: [], // category grades
        comments: String
    },
    individual_interview: {
        availability: {},
        questions: [],
        questionGrades: [],
        grades: [], // category grades
        interviewer: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        comments: String
    },
    group_interview: {
        grades: [], // category grades
        comment: String
    },
    applicationStage: {
        type: Number,
        default: 1,
    }, // 1 = written | 2 = individual interview | 3 = group interview
})

module.exports = Applicant = mongoose.model('Applicant', applicantSchema)