const { auth, applicantAuth }   = require('../../middleware/auth')
const ApplicantDetails      = require('../../models/ApplicationDetails')
const Applicant             = require('../../models/Applicant')
const User                  = require('../../models/User')
const router                = require('express').Router()

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

module.exports = router