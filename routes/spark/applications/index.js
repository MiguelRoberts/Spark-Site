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
                                    .populate('applicant_data')
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

        res.render('spark/applications', { 
            title: "Spark Applications",
            css: '<link rel="stylesheet" href="/css/spark/applications/index.css" />',
            js: '<script src="/js/spark/applications/index.js"></script>', 

            user: req.user,

            applications,
            cut_written, cut_individual, cut_group_i, cut_group_a
        })
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

        await Applicant.findByIdAndUpdate(applicant.applicant_data, { 'written.grades' : grades, 'written.comments' : comments })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

// @route   GET /spark/applications/individual-interview/:id
// @desc    View Individual Interview Availability
// @access  Protected
router.get('/individual-interview/:id', auth, sparkAuth, async (req, res) => {
    try {
        const applicant = await User
                                .findById(req.params.id)
                                .populate('applicant_data')
                                .exec()

        if (!applicant) return res.redirect('/spark/applications')

        res.render('spark/applications/individual', { 
            title: "Schedule Interview",
            css: `
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
                <link rel="stylesheet" href="/css/schedule.css" />
                <link rel="stylesheet" href="/css/spark/applications/individual.css" />
            `,
            js: `
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
                <script src="/js/spark/applications/individual.js"></script>
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

// @route   POST /spark/applications/individual-interview/:id
// @desc    Schedule Individual Interview
// @access  Protected
router.post('/individual-interview/:id', auth, sparkAuth, async (req, res) => {
    try {
        const { interviewer_id, hour, minutes } = req.body
        const time = `${hour}:${minutes}`

        const applicant = await User.findById(req.params.id)

        await Applicant.findByIdAndUpdate(applicant.applicant_data, { 
            'individual_interview.interviewer' : interviewer_id, 
            'individual_interview.interview_time' : time 
        })

        res.redirect('/spark/applications')
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router