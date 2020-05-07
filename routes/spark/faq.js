const { auth, sparkAuth }  = require('../../middleware/auth')
const FAQ       = require('../../models/FAQ')
const router    = require('express').Router()

// @route   GET /spark/faq
// @desc    FAQ Page
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        const questions = await FAQ.find()
        res.render('spark/faq', {
            title: "Spark FAQ",
            css: '/css/spark/faq.css',
            user: req.user, 
            questions
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router