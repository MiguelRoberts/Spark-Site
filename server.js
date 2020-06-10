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

// public routes
server.use('/', require('./routes/public'))

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

function updateStage(stage) {
    const Applicant = require('./models/Applicant')
    Applicant.find({}, (err, applicants) => {
        if (err) return console.log(err)
        applicants.forEach(applicant => {
            applicant.update({ application_stage: stage })
            // applicant.application_stage = stage
            // applicant.save()
        })
    })
}

// updateStage(1)

// TODO: Change width of scheduling interview - spark side
// TODO: Any spark leader can schedule the group interview date
// TODO: Add group interview creater in applications-control
// TODO: Update instructions for group interview
// TODO: Make signup button say Signed Up if you sign up
// TODO: Make Signup button say full under full gorup interviews (4 ppl)
// TODO: Make group interview button link to grade modal
// TODO: Accept Applicants!

// TODO: Work on Group Interview Stage
// TODO: Add Start Application Page
// TODO: Add "Thank You For Submitting" to written apps page
// TODO: Add Email-Applicants Button to Application-Controls Page
// TODO: Finish Email Functionality to Reset Passwords | Add Admin Functionality
// TODO: Add Form Response When Users Submit Question on FAQ Page
// TODO: Add Attendance Functionality to Spark Events