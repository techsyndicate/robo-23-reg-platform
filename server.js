require('dotenv').config()

//modules
const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    ejs = require('ejs'),
    path = require('path'),
    session = require('cookie-session'),
    passport = require('passport'),
    passportInit = require('./utils/passportConfig.js'),
    flash = require('express-flash'),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose');
    nodemailer = require('nodemailer')
    twilio = require('twilio')

//routes
const landing = require('./routers/landingRouter.js');

const app = express(),
    PORT = process.env.PORT || 5000;

//app middleware
app.set('view engine', 'ejs')
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

//more passport
app.use(passport.initialize())
app.use(passport.session())

//main
app.use('/', landing)

app.get("/bakwaspage", (req,res) => {
    res.render('bakwas.ejs')
})
app.post("/bakwaspage", (req,res) => {
    sendMail()
    res.render('bakwas.ejs')
})
app.post("/sms", (req,res) => {
    sendMessage()
    res.render('bakwas.ejs')
})

app.get('/404', (req, res) => {
    res.render('404', { user: req.user })
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


var client = new twilio('AC584008d51aecc9ecbf624de99a20b074', '5e3960ed1cb85c8d47488aa61237826b');

function sendMessage() {
    client.messages.create({
        to: '+918851334909',
        from: '(619) 727-6302',
        body: 'Hello from Twilio!'
      });
}

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'bhavit.grover@ais.amity.edu',
    pass: '@FAD1B41S'
  }


});
async function sendMail() {
    var mailOptions = {
        from: 'bhavit.grover@ais.amity.edu',
        to: 'groverbhavit@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });  
}
