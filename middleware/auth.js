const jwt   = require('jsonwebtoken')
const User  = require('../models/User')

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')

    // Check token
    if(!token) return res.status(401).json({ msg: 'No token, authorization denied' })

    try {
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT)
        
        // Add user from payload
        req.user = decoded
        next()
    } catch (err) {
        res.status(400).json({ msg: 'Invalid Token' })
    }
}

const sparkAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user.leader_data)
            return res.status(400).json({ msg: 'Invalid Permissions' })

        next()
    } catch (e) {
        res.status(500).json({ msg: 'Error validating user.' })
    }
}

module.exports = { auth, sparkAuth }