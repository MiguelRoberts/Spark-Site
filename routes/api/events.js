const Event     = require('../../models/Event')
const router    = require('express').Router()
const { auth, sparkAuth }  = require('../../middleware/auth')

// @route   POST /api/events
// @desc    Create Event
// @access  Protected
router.post('/', auth, async (req, res) => {
    const eventData = { title, start, end } = req.body

    if (!title || !start || !end) 
        return res.status(400).send({ msg: 'Please Enter All Fields' })

    try {
        const event = await Event.create(eventData)
        res.send(event)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   GET /api/events
// @desc    GET Events
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({})
        res.send(events)
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router