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

// TODO: Finish Email Functionality to Reset Passwords | Add Admin Functionality
// TODO: Add Form Response When Users Submit Question on FAQ Page
// TODO: Add Attendance Functionality to Spark Events

// const ApplicationDetails = require('./models/ApplicationDetails')
// async function stuff() {
//     const a = await ApplicationDetails.create({
//         applicationsOpen: true,
//         written: {
//             questions: ["Written Question 1", "Written Question 2", "Written Question 3", "Written Question 4", "Written Question 5"], // written questions
//             categories: ["Written Category 1", "Written Category 2", "Written Category 3"] // categories to be graded on
//         },
//         individual_interview: {
//             questions: [], // pool of all questions that can be asked in the interview
//             categories: ["Individual Category 1", "Individual Category 2", "Individual Category 3", "Individual Category 4", "Individual Category 5"] // categories to be graded on
//         },
//         group_interviews: {
//             categories: ["Group Category 1", "Group Category 2", "Group Category 3", "Group Category 4"] // categories to be graded on
//         }
//     })
//     console.log(a)
// }

// stuff()