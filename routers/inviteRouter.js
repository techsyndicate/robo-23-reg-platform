const router = require('express').Router();
const bodyParser = require('body-parser');
const sendMail = require('../utils/mailHelper');
const ejs = require('ejs')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', (req, res) => {
    res.render('invite', { user: req.user })
});

// router.post('/len', (req, res) => {
//     console.log(req.body.count)
// })

router.post('/', urlencodedParser, async (req, res) => {
    console.log(req.body.email)
    if (Array.isArray(req.body.email)) {
        const emails = req.body.email
        var answers = []
        for (var i = 0; i < emails.length; i++) {
            answers.push(await sendMail(emails[i], "hello", "Invite for Robotronics '23", await ejs.renderFile(__dirname + "/../views/inviteMail.ejs")))
            if (i == emails.length - 1) {
                res.send("Emails sent successfully")
            }
        }
    } else {
        const answer = await sendMail(req.body.email, "hello", "Invite for Robotronics '23", await ejs.renderFile(__dirname + "/../views/inviteMail.ejs"))
        res.send("Email sent successfully") 
    }
})

//export router
module.exports = router;