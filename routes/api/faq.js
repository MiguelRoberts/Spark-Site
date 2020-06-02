const router                = require('express').Router()
const { auth, sparkAuth }   = require('../../middleware/auth')

// @route   PUT /api/faq
// @desc    Answer a Question
// @access  Protected
router.put('/', auth, sparkAuth, async (req, res) => {
    try {
        const { id, answer } = req.body

        if (!answer) return res.status(400).send({ msg: 'No Answer Given' })
        
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
// @desc    Get Answered Questions
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
// @desc    Get Unanswered Questions
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