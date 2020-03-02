const FAQ                   = require('../../models/FAQ')
const router                = require('express').Router()
const { auth, sparkAuth }   = require('../../middleware/auth')

// @route   POST /api/faq
// @desc    Submit a Question
// @access  Public

router.post('/', async (req, res) => {
    try {
        const faqInfo = { email, question } = req.body

        if (!email || !question) res.status(400).send({ msg: 'Please Enter All Fields' })

        const faq = await FAQ.create(faqInfo)
        res.json(faq)
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'Error submitting quesion' })
    }
})

// @route   PUT /api/faq
// @desc    Answer a Question
// @access  Protected

router.put('/', auth, sparkAuth, async (req, res) => {
    try {
        const { id, answer } = req.body

        if (!answer) res.status(400).send({ msg: 'No Answer Given' })
        
        const question = await FAQ.findById(id)
        question.answer = answer
        await question.save()
        res.json(question)
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: 'Error answering quesion' })
    }
})

// @route   GET /api/faq/answered
// @desc    Gets all answered questions
// @access  Public
router.get('/answered', async (req, res) => {
    try {
        const questions = await FAQ.find({ answer: { $exists: true } })
        res.json(questions)
    } catch(e) {
        console.log(e)
        res.status(500).json({ msg: 'Error getting questions' })
    }
})

// @route   GET /api/faq/unanswered
// @desc    Gets all unanswered questions
// @access  Public
router.get('/unanswered', async (req, res) => {
    try {
        const questions = await FAQ.find({ answer: { $exists: false } })
        res.json(questions)
    } catch(e) {
        console.log(e)
        res.status(500).json({ msg: 'Error getting questions' })
    }
})

module.exports = router