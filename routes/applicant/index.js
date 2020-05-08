const { auth, applicantAuth }   = require('../../middleware/auth')
const ApplicationDetails        = require('../../models/ApplicationDetails')
const Applicant                 = require('../../models/Applicant')
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