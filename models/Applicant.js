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
        questionGrades: [Number],
        grades: [Number], // category grades
        interviewer: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        interview_time: String,
        comments: String
    },
    group_interview: {
        grades: [Number], // category grades
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