const router = require('express').Router();
const bodyParser = require('body-parser');
const sendMail = require('../utils/mailHelper');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', (req, res) => {
    res.render('invite', { user: req.user })
});

// router.post('/len', (req, res) => {
//     console.log(req.body.count)
// })

router.post('/', urlencodedParser, async (req, res) => {
    console.log(req.body.email)
    const emails = req.body.email
    for (var i = 0; i < emails.length; i++) {
        sendMail(emails[i], "hello", "this is the text", "<h1>Hello there</h1>")
    }
    res.send('EMAILS SENT');
})

//export router
module.exports = router;