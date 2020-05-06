const { auth }  = require('../../middleware/auth')
const User      = require('../../models/User')
const router    = require('express').Router()

// @route   GET /spark
// @desc    Spark Homepage
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        if (!req.user) return res.status(500).send('Error Authenticating User')

        res.render('spark/home', { 
            css: '<link href="/css/spark/index.css" />', 
            user: req.user
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Error')
    }
})

module.exports = router