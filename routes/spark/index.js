const { auth }  = require('../../middleware/auth')
const User      = require('../../models/User')
const router    = require('express').Router()

// @route   GET /spark
// @desc    Spark Homepage
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        const user = (await User.findById(req.user._id).select('-password')).toObject()

        if (!user) return res.status(500).send('Error Authenticating User')

        console.log(user)

        res.render('home', { user })
    } catch (e) {
        res.status(500).send('Error')
    }
})

module.exports = router