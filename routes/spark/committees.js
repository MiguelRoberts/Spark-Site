const { auth, sparkAuth }  = require('../../middleware/auth')
const router    = require('express').Router()

// @route   GET /spark/committee
// @desc    (write here alek)
// @access  Protected
router.get('/', auth, async (req, res) => {
    try {
        res.render('committees', {
            css: `
                <link rel="stylesheet" href="/css/spark/committees.css" />
            `,
            js: `
                <script src="/js/spark/committees.js"></script>
            `,
            user: req.user
        })
    } catch (e) {
        console.log(e)
        res.status(500).send('Server Error')
    }
})

module.exports = router