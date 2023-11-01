require('dotenv').config()

//modules
const express = require('express'),
    session = require('cookie-session'),
    passport = require('passport'),
    passportInit = require('./utils/passportConfig.js'),
    flash = require('express-flash'),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    path=require('path'),
    request = require('request');
//routes
const loginRouter = require('./routers/loginRouter.js'),
    dashboardRouter = require('./routers/dashboardRouter.js'),
    adminRouter = require('./routers/adminRouter.js'),
    { discoIt } = require('./utils/discordBot'),
    userSchema = require('./schemas/userSchema.js'),
    teamSchema = require('./schemas/teamSchema.js');

const app = express(),
    PORT = process.env.PORT || 5000;

//app middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }), express.urlencoded({ extended: true, limit: '1mb' }))
app.use(flash())
app.use(expressLayouts)
app.use('/', express.static('public'))

//passport middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))

passportInit(passport)

//connect mongodb
const dbUri = process.env.MONGO_URI
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Connected to mongodb"))

// //discord 
// botInit()
//more passport
app.use(passport.initialize())
app.use(passport.session())


function checkadmin(req, res, next) {
    if (req.user.admin) {
        return next()
    }
    res.redirect('/dashboard')
}

//main
app.get('/', (req, res) => {
    res.render('index', { user: req.user })
});
app.use('/login', loginRouter)
app.use('/admin', checkadmin, adminRouter)
app.use('/dashboard', dashboardRouter)

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// app.use((err, req, res, next) => {
//     discoIt(err.stack.toString())
//     discoIt("App Has Crashed, Please Check The Logs, Trying To Restart On My Own!");
//     next()
// })

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    discoIt("Server started on port " + PORT)
});