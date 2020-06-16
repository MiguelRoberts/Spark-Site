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
        
        res.redirect('back')
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/applicant/get_availability
// @desc    Get Availability For Individual Interview
// @access  Protected
router.get('/get_availability/:id', auth, applicantAuth, async (req, res) => {
    try {
        const application = await Applicant.findById(req.params.id)
        res.send({
            availability: application.individual_interview.availability
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/applicant/update_availability
// @desc    Submit Availability For Individual Interview
// @access  Protected
router.post('/update_availability', auth, applicantAuth, async (req, res) => {
    try {
        const { schedule:availability } = req.body
        await Applicant.findByIdAndUpdate(req.user.applicant_data, { 'individual_interview.availability' : availability })

        res.send({ msg: 'Successfully Updated Availability' })
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