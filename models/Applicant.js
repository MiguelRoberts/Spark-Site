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
        availability: {
            monday: [],
            tuesday: [],
            thursday: [],
            friday: []
        },
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
    application_stage: {
        type: Number,
        default: 1,
    }, // 1 = written | 2 = individual interview | 3 = group interview
    cut: {
        type: Boolean,
        default: false
    }
})

module.exports = Applicant = mongoose.model('Applicant', applicantSchema)