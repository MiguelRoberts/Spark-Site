const { auth, sparkAuth }   = require('../../middleware/auth')
const ApplicantDetails      = require('../../models/ApplicationDetails')
const Applicant             = require('../../models/Applicant')
const Groups                = require('../../models/Groups')
const User                  = require('../../models/User')
const router                = require('express').Router()

// @route   GET /api/application-details/written-deadline
// @desc    GET Written Deadline
// @access  Protected
router.get('/written-deadline', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ deadline: details.written.deadline })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/written-deadline
// @desc    Update Written Deadline
// @access  Protected
router.post('/written-deadline', auth, sparkAuth, async (req, res) => {
    const { deadline } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'written.deadline' : deadline })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/written-questions
// @desc    GET Written Questions
// @access  Protected
router.get('/written-questions', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ elements: details.written.questions })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/written-questions
// @desc    Update Written Questions
// @access  Protected
router.post('/written-questions', auth, sparkAuth, async (req, res) => {
    const { elements:questions } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'written.questions' : questions })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/written-categories
// @desc    GET Written Categories
// @access  Protected
router.get('/written-categories', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ elements: details.written.categories })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/written-categories
// @desc    Update Written Categories
// @access  Protected
router.post('/written-categories', auth, sparkAuth, async (req, res) => {
    const { elements:categories } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'written.categories' : categories })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/individual-interview-questions
// @desc    GET Individual Interview Questions
// @access  Protected
router.get('/individual-interview-questions', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ elements: details.individual_interview.questions })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/individual-interview-questions
// @desc    Update Individual Interview Questions
// @access  Protected
router.post('/individual-interview-questions', auth, sparkAuth, async (req, res) => {
    const { elements:questions } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'individual_interview.questions' : questions })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/individual-interview-categories
// @desc    GET Individual Interview Questions
// @access  Protected
router.get('/individual-interview-categories', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ elements: details.individual_interview.categories })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/individual-interview-categories
// @desc    Update Individual Interview Categories
// @access  Protected
router.post('/individual-interview-categories', auth, sparkAuth, async (req, res) => {
    const { elements:categories } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'individual_interview.categories' : categories })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/group-interview-dates
// @desc    GET Group Interview Times
// @access  Protected
router.get('/group-interview-dates', auth, sparkAuth, async (req, res) => {
    try {
        const groups = await Groups.find()

        res.send({ groups })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/group-interview-dates
// @desc    Create Group Interview Time
// @access  Protected
router.post('/group-interview-dates', auth, sparkAuth, async (req, res) => {
    const groupInfo = { name, date, mods, room } = req.body
    try {
        await Groups.create(groupInfo)
        res.send({ msg: "Created Group Interview" })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/group-interview/join
// @desc    Join Group Interview
// @access  Protected
router.post('/group-interview/:id/join', auth, async (req, res) => {
    const { user_id, leader_data } = req.body

    try {
        const group = await Groups.findById(req.params.id)
        const groups = await Groups.find({})
        
        // if user is a leader add to leaders array
        if (leader_data) {
            if (group.leaders.indexOf(user_id) !== -1 || group.leaders.length === 5) return

            // remove user from any group they may have previously signed up for
            groups.forEach(async g => {
                let i = g.leaders.indexOf(user_id)
                if (i === -1) return

                g.leaders.splice(i, 1)
                await g.save()
            })

            group.leaders.push(user_id)
            await group.save()
        
        // else add user to applicants array
        } else {
            if (group.applicants.indexOf(user_id) !== -1 || group.applicants.length === 4) return

            // remove user from any group they may have previously signed up for
            groups.forEach(async g => {
                let i = g.applicants.indexOf(user_id)
                if (i === -1) return

                g.applicants.splice(i, 1)
                await g.save()
            })

            group.applicants.push(user_id)
            await group.save()
        }

        res.send({ msg: 'Signed Up For Group Interview' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   DELETE /api/application-details/group-interview/delete
// @desc    Delete Group Interview
// @access  Protected
router.delete('/group-interview/:id/delete', auth, sparkAuth, async (req, res) => {
    try {
        await Groups.findByIdAndDelete(req.params.id)
        res.send({ msg: "Deleted Group Interview" })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/application-details/group-interview-categories
// @desc    GET Group Interview Categories
// @access  Protected
router.get('/group-interview-categories', auth, sparkAuth, async (req, res) => {
    try {
        const details = await ApplicantDetails.findOne()

        res.send({ elements: details.group_interview.categories })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/application-details/group-interview-categories
// @desc    Update Group Interview Categories
// @access  Protected
router.post('/group-interview-categories', auth, sparkAuth, async (req, res) => {
    const { elements:categories } = req.body
    try {
        await ApplicantDetails.findOneAndUpdate({}, { 'group_interview.categories' : categories })

        res.send({ msg: 'Successfully Submitted Responses' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router