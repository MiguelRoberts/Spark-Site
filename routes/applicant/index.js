const { auth, applicantAuth }  = require('../../middleware/auth')
const router    = require('express').Router()

// @route   GET /applicant
// @desc    Applicant Homepage
// @access  Protected
router.get('/', auth, applicantAuth, async (req, res) => {
    try {
        res.render('applicant/home', { 
            title: "Spark Applicant",
            css: '<link href="/css/applicant/index.css" />',
            user: req.user
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router