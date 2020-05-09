const { auth, sparkAuth }   = require('../../../middleware/auth')
const User                  = require('../../../models/User')
const Applicant             = require('../../../models/Applicant')
const router                = require('express').Router()

// @route   GET /spark/applications/
// @desc    Spark Application Review
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        const applications = await User
                                    .find({ applicant_data: { $exists: true } })
                                    .populate('applicant_data')
                                    .exec()
        
        res.render('spark/applications', { 
            title: "Spark Applications",
            css: '<link rel="stylesheet" href="/css/spark/applications/index.css" />',
            js: '<link href="/js/spark/applications/index.js" />', 
            user: req.user,
            applications
        })
    } catch (e) {
        res.status(500).send('Error')
    }
})

module.exports = router