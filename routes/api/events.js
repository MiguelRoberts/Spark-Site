const Event     = require('../../models/Event')
const router    = require('express').Router()
const { auth, sparkAuth }  = require('../../middleware/auth')

// @route   POST /api/events
// @desc    Create Event
// @access  Protected
router.post('/', auth, async (req, res) => {
    const eventData = { title, start, end, public } = req.body
    eventData.owners = eventData.owners || [req.user._id]
    
    if (!title || !start || !end) 
        return res.status(400).send({ msg: 'Please Enter All Fields' })

    eventData.public = public === undefined ? false : public === "on" ? true : false

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

// @route   POST /api/events/:eventId/owners
// @desc    Update User's Availability For an Event
// @access  Protected
router.post('/:id/owners', auth, async (req, res) => {
    try {
        const owners = req.owners

        if (!owners) throw Error('Owners field cannot be empty')

        const event = await Event.findById(req.params.id)
        await event.update({ owners })

        res.send({ msg: 'Sucess' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

// @route   POST /api/events/:eventId/availability
// @desc    Update User's Availability For an Event
// @access  Protected
router.post('/:id/availability', auth, async (req, res) => {
    try {
        const update = { firstname, lastname, availability } = req.params

        if (!firstname || !lastname || !availability) throw Error('Missing one or more fields')

        const event = await Event.findById(req.params.id)
        let newAvailability = event.availability.concat(update)
        await event.update({ availability: newAvailability })

        res.send({ msg: 'Sucess' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ msg: 'Server Error' })
    }
})

module.exports = router