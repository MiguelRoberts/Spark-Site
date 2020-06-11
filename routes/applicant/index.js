const { auth, applicantAuth }   = require('../../middleware/auth')
const ApplicationDetails        = require('../../models/ApplicationDetails')
const Applicant                 = require('../../models/Applicant')
const Groups                    = require('../../models/Groups')
const User                      = require('../../models/User')
const router                    = require('express').Router()

// @route   GET /applicant
// @desc    Applicant Homepage
// @access  Protected
router.get('/', auth, applicantAuth, async (req, res) => {
    try {
        const details = await ApplicationDetails.findOne()

        let user = req.user
        
        user = await User
                        .findById(req.user._id)
                        .populate({ 
                            path: 'applicant_data',
                            populate: { 
                                path: 'individual_interview.interviewer'
                            }
                        })
                        .exec()
        
        const stylesheets = [
            '<link rel="stylesheet" href="/css/applicant/written.css" />',
            '<link rel="stylesheet" href="/css/applicant/individual.css" /><link rel="stylesheet" href="/css/schedule.css" />',
            '<link rel="stylesheet" href="/css/applicant/group_interview.css" />',
            '<link rel="stylesheet" href="/css/applicant/group_activity.css" />',
        ]

        const scripts = [
            '<script src="/js/applicant/written.js"></script>',
            '<script src="/js/applicant/individual.js"></script><script src="/js/schedule.js"></script>',
            '<script src="/js/applicant/group_interview.js"></script>',
            '<script src="/js/applicant/group_activity.js"></script>',
        ]

        let css = '<link rel="stylesheet" href="/css/applicant/index.css" />'
        let js = '<script src="/js/applicant/app.js"></script>'

        if (user.applicant_data.application_stage !== 0 && user.applicant_data.application_stage !== 5) {
            css += stylesheets[user.applicant_data.application_stage-1]
            js += scripts[user.applicant_data.application_stage]
        }

        if (user.applicant_data.application_stage === 3 || user.applicant_data.application_stage === 4) {
            const groups = await Groups.find().populate('applicants').exec()
            const group_interviews = groups.filter(group => group.name === 'Group Interview')
            const group_activities = groups.filter(group => group.name === 'Group Activity')
            const active_applicants = await Applicant.find({ cut: false })

            return res.render('applicant/home', { 
                title: "Spark Applicant",
                user,
                css,
                js,
                details,
                group_interviews,
                group_activities,
                group_activity_limit: (active_applicants / 2) + 2
            }) 
        }

        res.render('applicant/home', { 
            title: "Spark Applicant",
            user,
            css,
            js,
            details,
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router