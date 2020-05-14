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

        if (user.applicant_data.applicationStage === 3) {
            const groups = await Groups.find({ name: 'Group Interview' })
            return res.render('applicant/home', { 
                title: "Spark Applicant",
                user,
                css: '<link rel="stylesheet" href="/css/applicant/index.css" />',
                details,
                groups
            }) 
        }

        res.render('applicant/home', { 
            title: "Spark Applicant",
            user,
            css: '<link rel="stylesheet" href="/css/applicant/index.css" />',
            details,
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router