const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const applicantSchema = new Schema({
    written: {
        activities: [],
        responses: [],
        grades: [Number], // category grades
        comments: String
    },
    individual_interview: {
        availability: {
            monday: [{
                type: Number,
                default: []
            }],
            tuesday: [{
                type: Number,
                default: []
            }],
            thursday: [{
                type: Number,
                default: []
            }],
            friday: [{
                type: Number,
                default: []
            }]
        },
        questions: [Number],
        responses: [String],
        questionGrades: [Number],
        grades: [Number], // category grades
        interviewer: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        interview_date: String,
        interview_time: String,
        comments: String
    },
    group_interview: {
        grades: [Number], // category grades
        comment: String
    },
    application_stage: {
        type: Number,
        default: 0,
    }, // 0 = it is not time to apply | 1 = written application | 2 = individual interview | 3 = group interview | 4 = group activity | 5 = Accepted!
    cut: {
        type: Boolean,
        default: false
    }
})

module.exports = Applicant = mongoose.model('Applicant', applicantSchema)