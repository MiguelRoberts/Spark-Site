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
        if (details.applicationsOpen) 
            user = await User
                            .findById(req.user._id)
                            .populate('applicant_data')
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
            '<script src="/js/applicant/group_activity.js"></script>'
        ]

        let css = '<link rel="stylesheet" href="/css/applicant/index.css" />' + stylesheets[user.applicant_data.application_stage-1]
        let js = '<script src="/js/applicant/app.js"></script>' + scripts[user.applicant_data.application_stage-1]

        if (user.applicant_data.application_stage === 3) {
            const groups = await Groups.find({ name: 'Group Interview' })
            return res.render('applicant/home', { 
                title: "Spark Applicant",
                user,
                css,
                js,
                details,
                groups
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