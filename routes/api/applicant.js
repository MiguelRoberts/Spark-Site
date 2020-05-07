const { auth, applicantAuth }   = require('../../middleware/auth')
const ApplicantDetails      = require('../../models/ApplicationDetails')
const Applicant             = require('../../models/Applicant')
const User                  = require('../../models/User')
const router                = require('express').Router()

// @route   POST /api/applicant/written
// @desc    Submit Written Application
// @access  Protected
router.get('/', auth, applicantAuth, async (req, res) => {
    try {
        
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router