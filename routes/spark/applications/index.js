const { auth, sparkAuth }   = require('../../../middleware/auth')
const User                  = require('../../../models/User')
const Applicant             = require('../../../models/Applicant')
const ApplicationDetails    = require('../../../models/ApplicationDetails')
const router                = require('express').Router()

// @route   GET /spark/applications/
// @desc    Spark Application Review
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        let all_applications = await User
                                    .find({ 
                                        applicant_data: { $exists: true }
                                    })
                                    .populate({
                                        path: 'applicant_data',
                                        populate: {
                                            path: 'individual_interview.interviewer'
                                        }
                                    })
                                    .exec()
                                
        // applicants that haven't been cut
        let applications = all_applications.filter(a => a.applicant_data.cut === false)

        // cut applicants
        let cut = all_applications.filter(a => a.applicant_data.cut === true)

        // applicants that were cut during written stage
        let cut_written = cut.filter(a => a.applicant_data.application_stage === 1)
        
        // applicants that were cut during individual interview stage
        let cut_individual = cut.filter(a => a.applicant_data.application_stage === 2)
        
        // applicants that were cut during group interview stage
        let cut_group_i = cut.filter(a => a.applicant_data.application_stage === 3)

        // applicants that were cut during group activity stage
        let cut_group_a = cut.filter(a => a.applicant_data.application_stage === 4)
        
        const stage = ['Written Application', 'Individual Interview', 'Group Interview', 'Group Activitiy'][applications[0].applicant_data.application_stage-1]

        res.render('spark/applications', { 
            title: "Spark Applications",
            css: '<link rel="stylesheet" href="/css/spark/applications/index.css" />',
            js: '<script src="/js/spark/applications/index.js"></script>', 

            user: req.user,

            applications,
            cut_written, cut_individual, cut_group_i, cut_group_a,
            stage
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   POST /spark/applications/advance
// @desc    Advance Applicants to Next Stage
// @access  Protected
router.post('/advance', auth, sparkAuth, async (req, res) => {
    try {
        await Applicant.updateMany({ cut: false }, { $inc: { application_stage: 1 } })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   POST /spark/applications/cut/:id
// @desc    Cut Applicant
// @access  Protected
router.post('/cut/:id', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id)

        await Applicant.findByIdAndUpdate(applicant.applicant_data, { cut: true })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   GET /spark/applications/written/:id
// @desc    View Written Application
// @access  Protected
router.get('/written/:id', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User
                                .findById(req.params.id)
                                .populate('applicant_data')
                                .exec()

        if (!applicant) return res.redirect('/spark/applications')

        const written = applicant.applicant_data.written

        const applicationDetails = await ApplicationDetails.findOne()
        const written_application = applicationDetails.written

        res.render('spark/applications/written', { 
            title: "Grade Written Application",
            css: `
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
                <link rel="stylesheet" href="/css/applicant/index.css" />
                <link rel="stylesheet" href="/css/spark/applications/written.css" />
            `,
            js: `
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
                <script src="/js/spark/applications/written.js"></script>
            `, 
            user: req.user,
            applicant,
            written,
            written_application
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   POST /spark/applications/written/:id
// @desc    Grade Written Application
// @access  Protected
router.post('/written/:id', auth, sparkAuth, async (req, res) => {
    try {
        const { grades, comments } = req.body
        const applicant = await User.findById(req.params.id)

        await Applicant.findByIdAndUpdate(applicant.applicant_data, { 
            'written.grades' : grades, 
            'written.comments' : comments 
        })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   GET /spark/applications/individual-interview/:id/schedule
// @desc    View Individual Interview Availability
// @access  Protected
router.get('/individual-interview/:id/schedule', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User
                                .findById(req.params.id)
                                .populate('applicant_data')
                                .exec()

        if (!applicant) return res.redirect('/spark/applications')

        res.render('spark/applications/individual_schedule', { 
            title: "Schedule Interview",
            css: `
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
                <link rel="stylesheet" href="/css/schedule.css" />
                <link rel="stylesheet" href="/css/spark/applications/individual_schedule.css" />
            `,
            js: `
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
                <script src="/js/spark/applications/individual_schedule.js"></script>
                <script src="/js/schedule.js"></script>
            `, 
            user: req.user,
            applicant
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   POST /spark/applications/individual-interview/:id/schedule
// @desc    Schedule Individual Interview
// @access  Protected
router.post('/individual-interview/:id/schedule', auth, sparkAuth, async (req, res) => {
    try {
        const { interviewer_id, date, hour, minutes } = req.body
        const time = `${hour}:${minutes}`

        const applicant = await User.findById(req.params.id)
        
        await Applicant.findByIdAndUpdate(applicant.applicant_data, { 
            'individual_interview.interviewer' : interviewer_id,
            'individual_interview.interview_date' : date,
            'individual_interview.interview_time' : time
        })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   GET /spark/applications/individual-interview/:id
// @desc    View Grade Page For Individual Interview
// @access  Protected
router.get('/individual-interview/:id/grade', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User
                                .findById(req.params.id)
                                .populate('applicant_data')
                                .exec()

        if (!applicant) return res.redirect('/spark/applications')

        const interview = applicant.applicant_data.individual_interview

        const applicationDetails = await ApplicationDetails.findOne()
        const individual_interview = applicationDetails.individual_interview

        res.render('spark/applications/individual_grade', { 
            title: "Grade Interview",
            css: `
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
                <link rel="stylesheet" href="/css/spark/applications/individual_grade.css" />
            `,
            js: `
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
                <script src="/js/spark/applications/individual_grade.js"></script>
            `, 
            user: req.user,
            applicant,
            interview,
            individual_interview
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   POST /spark/applications/written/:id
// @desc    Grade Written Application
// @access  Protected
router.post('/individual-interview/:id/grade', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User.findById(req.params.id)

        const type = req.body.type

        if (type === "questions") {
            const { questions, responses, grades } = req.body

            await Applicant.findByIdAndUpdate(applicant.applicant_data, {
                'individual_interview.questions' : questions, 
                'individual_interview.responses' : responses,
                'individual_interview.questionGrades' : grades
            })

            res.redirect('back')
        } else {
            const { grades, comments } = req.body
            const applicant = await User.findById(req.params.id)

            await Applicant.findByIdAndUpdate(applicant.applicant_data, {
                'individual_interview.grades' : grades, 
                'individual_interview.comments' : comments 
            })

            res.redirect('/spark/applications')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router