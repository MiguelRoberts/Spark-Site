const { auth, sparkAuth }   = require('../../../middleware/auth')
const User                  = require('../../../models/User')
const router                = require('express').Router()

// @route   GET /spark/applications/
// @desc    Spark Application Review
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        const user = (await User.findById(req.user._id).select('-password')).toObject()

        if (!user) return res.status(500).send('Error Authenticating User')

        res.render('spark/applications', { 
            css: '<link rel="stylesheet" href="/css/spark/applications/index.css" />',
            js: '<link href="/js/spark/applications/index.js" />', 
            user 
        })
    } catch (e) {
        res.status(500).send('Error')
    }
})

module.exports = router