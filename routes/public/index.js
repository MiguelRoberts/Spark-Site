const FAQ       = require('../../models/FAQ')
const Events    = require('../../models/Event')
const router    = require('express').Router()

// @route   GET /faq
// @desc    Frequently Asked Questions Page
// @access  Public
router.get('/faq', async (req, res) => {
    try {
        const questions = await FAQ.find({ answer: { $exists: true } })
        res.render('public/faq' , { questions })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'Server Error' }) 
    }
})

// @route   POST /api/faq
// @desc    Submit a Question
// @access  Public
router.post('/faq', async (req, res) => {
    try {
        const faqInfo = { email, question } = req.body

        if (!email || !question) 
            return res.status(400).send({ msg: 'Please Enter All Fields' })

        const faq = await FAQ.create(faqInfo)
        res.render('public/faq')
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'Error submitting quesion' })
    }
})

// @route   GET /calendar
// @desc    Public Spark Calendar
// @access  Public
router.get('/calendar', async (req, res) => {
    try {
        const events = await Events.find({ public: true })

        const upcomingEvents = events.filter(event => {
            const event_date = event.start.split('-')
            const event_year = Number(event_date[0])
            const event_month = Number(event_date[1])
            const event_day = Number(event_date[2])

            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDay()

            if (event_year >= year) {
                if (event_month > month) return true
                else if (event_month === month && event_day >= day) return true
                else return false
            }

            return false
        })

        console.log(upcomingEvents)

        res.render('public/calendar', { upcomingEvents })
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'Error submitting quesion' })
    }
})

module.exports = router