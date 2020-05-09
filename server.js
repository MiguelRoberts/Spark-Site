const express           = require('express')
const bodyParser        = require('body-parser')
const cookieParser      = require('cookie-parser')
const methodOverride    = require('method-override')
const mongoose          = require('mongoose')
const path              = require('path')

// env config
require('dotenv').config()

// server config
const server = express()
server.use(express.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser(process.env.COOKIE))
server.use(methodOverride('_method'))

// connect to mongodb
const db = process.env.DB
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(`Error connecting to MongoDB:\n${err}`))

// ejs config
server.set('view engine', 'ejs')

// api routes
server.use('/api/users', require('./routes/api/users'))
server.use('/api/auth', require('./routes/api/auth'))
server.use('/api/faq', require('./routes/api/faq'))
server.use('/api/events', require('./routes/api/events'))
server.use('/api/applicant', require('./routes/api/applicant'))
server.use('/api/application-details', require('./routes/api/application-details'))

// applicant routes
server.use('/applicant', require('./routes/applicant'))

// spark routes
server.use('/spark', require('./routes/spark'))
server.use('/spark/faq', require('./routes/spark/faq'))
server.use('/spark/calendar', require('./routes/spark/calendar'))
server.use('/spark/committees', require('./routes/spark/committees'))
server.use('/spark/applications', require('./routes/spark/applications'))
server.use('/spark/application-controls', require('./routes/spark/application-controls'))

// serve static assets
server.use(express.static(path.join(__dirname, 'public')))

// start server
const port = process.env.PORT || 8000
server.listen(port, () => console.log(`Server running on port ${port}...`))

// TODO: Add Open Applications Button to Application-Controls Page
// TODO: Add Email-Applicants Button to Application-Controls Page

// TODO: Finish Email Functionality to Reset Passwords | Add Admin Functionality
// TODO: Add Form Response When Users Submit Question on FAQ Page
// TODO: Add Attendance Functionality to Spark Events