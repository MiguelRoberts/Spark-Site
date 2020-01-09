const path = require('path')
const express = require('express')
const server = express()

server.use(express.static(path.join(__dirname, 'public')))

server.listen(3000, () => console.log(`Server running on port ${3000}`))
