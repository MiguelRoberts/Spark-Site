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
        let applications = await User
                                    .find({ 
                                        applicant_data: { $exists: true }
                                    })
                                    .populate('applicant_data')
                                    .exec()

        applications = applications.filter(applicant => applicant.applicant_data.cut === false)
        console.log(applications)

        // applications 
        // cut_written
        // cut_individual
        // cut_group_i
        // cut_group_a

        res.render('spark/applications', { 
            title: "Spark Applications",
            css: '<link rel="stylesheet" href="/css/spark/applications/index.css" />',
            js: '<script src="/js/spark/applications/index.js"></script>', 
            user: req.user,
            applications
        })
    } catch (e) {
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

module.exports = router