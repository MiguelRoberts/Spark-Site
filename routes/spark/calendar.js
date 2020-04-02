const { auth, sparkAuth }  = require('../../middleware/auth')
const FAQ       = require('../../models/FAQ')
const router    = require('express').Router()

// @route   GET /spark/calendar
// @desc    Show Spark Calendar
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        res.render('calendar', {
            styles: 'calendar.css',
            user: req.user
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router