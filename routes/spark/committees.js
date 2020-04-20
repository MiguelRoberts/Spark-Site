const Committee             = require('../../models/Committee')
const router                = require('express').Router()
const { auth, sparkAuth }   = require('../../middleware/auth')

// @route   GET /spark/committee
// @desc    (write here alek)
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        const committees = await Committee.find()

        res.render('committees', {
            css: `
                <link rel="stylesheet" href="/css/spark/committees.css" />
            `,
            js: `
                <script src="/js/spark/committees.js"></script>
            `,
            user: req.user,
            committees
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router