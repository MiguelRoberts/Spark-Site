const { auth, sparkAuth }   = require('../../../middleware/auth')
const router                = require('express').Router()

// @route   GET /spark/application-controls/
// @desc    Spark Application Committee Main Page
// @access  Protected
router.get('/', auth, sparkAuth, async (req, res) => {
    try {
        res.render('spark/application-controls', { 
            title: "Application Controls",
            css: `
                <link rel="stylesheet" href="/css/spark/application-controls/index.css" />
                <link rel="stylesheet" href="/css/spark/micromodal.css" />
            `,
            js: `
                <script src="/js/spark/application-controls/index.js"></script>
                <script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
            `, 
            user: req.user
        })
    } catch (e) {
        res.status(500).send('Error')
    }
})

module.exports = router