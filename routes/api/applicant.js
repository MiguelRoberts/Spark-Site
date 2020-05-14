const { auth, applicantAuth }   = require('../../middleware/auth')
const ApplicantDetails          = require('../../models/ApplicationDetails')
const Applicant                 = require('../../models/Applicant')
const Groups                    = require('../../models/Groups')
const User                      = require('../../models/User')
const router                    = require('express').Router()

// @route   POST /api/applicant/written
// @desc    Submit Written Application
// @access  Protected
router.post('/written', auth, applicantAuth, async (req, res) => {
    try {
        let { activities:form_activities, hours:form_hours, responses } = req.body

        if (!form_activities || !form_hours || !responses) res.status(400).send({ msg: 'Please Enter All Fields' })

        let activities = []

        for (let i = 0; i < form_activities.length; i++) {
            activities[i] = {
                activity: form_activities[i],
                hours: form_hours[i]
            }
        }

        await Applicant.findByIdAndUpdate(req.user.applicant_data, { 'written.activities' : activities, 'written.responses' : responses })
        
        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/applicant/individual-interview
// @desc    Submit Availability For Individual Interview
// @access  Protected
router.post('/individual-interview', auth, applicantAuth, async (req, res) => {
    try {
        const { availability } = req.body

        await Applicant.findByIdAndUpdate(req.user.applicant_data, { 'individual_interview.availability' : availability })

        res.send({ msg: 'Successfully Update Availability' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/applicant/group-interview/:id
// @desc    Sign Up For Group Interview
// @access  Protected
router.post('/group-interview/:id', auth, applicantAuth, async (req, res) => {
    try {
        const group = await Groups.findById(req.params.id)

        
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router