const User      = require('../../models/User')
const Leader    = require('../../models/Leader')
const sgMail    = require('@sendgrid/mail');
const router    = require('express').Router()
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const request   = require('request')

// @route   POST /api/users
// @desc    Register New User
// @access  Public
router.post('/', async (req, res) => {    
    const userInfo = { firstname, lastname, email, grade, academy, password } = req.body

    // Simple validation
    if (!firstname || !lastname || !grade || !academy || !email || !password)
        return res.status(400).json({ msg: 'Please enter all fields' })

    if (password[0] !== password[1])
        return res.status(400).json({ msg: 'Passwords do not match' })
    else password = password[0]
    
    // Check for existing user
    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ msg: 'User with given email already exists' })

    // Create User
    const newUser = new User(userInfo)

    // if user is a spark leader add extra info
    if (req.body.type && req.body.type === 'leader') {
        const leaderInfo = { activities, committees, headshot } = req.body

        const leader = new Leader(leaderInfo)
        newUser.leader_data = leader._id
    }

    try {
        // Create password hash
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)

        newUser.password = hash
        let user = await newUser.save()

        const token = await jwt.sign({ _id: user.id }, process.env.JWT, { expiresIn: 86400 })

        res.json({
            token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                grade: user.grade,
                academy: user.academy,
                email: user.email,
            }
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({ msg: 'Error Creating User' })
    }
})

// @route   POST /api/users/reset
// @desc    Send Reset Password Email
// @access  Public
router.post('/send_reset_email', async (req, res) => {    
    const email = req.body.email

    // Simple validation
    if (!email)
        return res.status(400).json({ msg: 'Please enter an email' })

    try {
        // Find User
        const user = await User.findOne({ email })
        if (!user) return res.send({ type: 'error', msg: 'Invalid Email' })

        // create token for reset password url
        const token = await jwt.sign({ _id: user._id }, process.env.JWT, { expiresIn: 600 })

        const url = `http://localhost:8000/reset_password.html?token=${token}`

        // get reset-password
        request("http://localhost:8000/reset_password_template-email.html", 
            function(error, response, html) {
                if (error) throw new Error

                html = html.replace('<% name %>', user.firstname)
                html = html.replace('<% url %>', url)

                // email template with filled in values
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                console.log(html)
                
                const msg = {
                    to: user.email,
                    from: 'no-reply@spark-mailer.bergen.org',
                    subject: 'Reset Password',
                    html
                }
                
                sgMail.send(msg);
                res.send({ type: 'success', url })
            }
        )

    } catch(err) {
        console.log(err)
        res.send({ type: 'error', msg: 'An Error Occurred While Resetting Your Password.<br>Please Contact an Administrator or Try Again Later.' })
    }
})

// @route   POST /api/users/reset?token=""
// @desc    Reset Pasword
// @access  Public
router.post('/reset_password', async (req, res) => {
    const token = req.query.token
    const checkToken = req.body.checkToken

    // validate token
    if (checkToken) {
        try {
            const decoded = jwt.verify(token, process.env.JWT)
            return res.send({ type: 'success' })
        } catch (e) {
            return res.send({ type: 'error' })
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT)
        const user = await User.findById(decoded._id)
        
        let password = req.body.password
    
        // check if passwords match
        if (password[0] !== password[1]) 
            return res.send({ type: 'error', msg: 'Passwords do not match.' })
        
        // reset password
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password[0], salt)

        user.password = hash
        await user.save()

        res.send({ type: 'success' })
    } catch(e) {
        if (e.name === 'TokenExpiredError')
            res.send({ type: 'error', msg: 'Your reset password token has expired.<br/>Click <a href="/forgot_password.html">here</a> to reset your password again.'})
        res.send({ type: 'error', msg: 'An Error Occurred While Resetting Your Password.<br>Please Contact an Administrator or Try Again Later.'})
    }
})

module.exports = router