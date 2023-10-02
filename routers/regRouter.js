const router = require('express').Router()
const User = require('../schemas/userSchema.js')
const bcrypt = require('bcrypt')
const {ensureAuthenticated, forwardAuthenticated} = require('../middleware/authenticate.js')
const passport = require('passport')
router.get('/school', forwardAuthenticated, (req, res) => {
    res.render('schoolReg', { user: req.user })
});

router.get('/indi', forwardAuthenticated, (req, res) => {
    res.render('indiReg', { user: req.user })
});

router.post('/school', forwardAuthenticated, async (req, res)=> {
    let errors = []
    const {schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone, password, cpassword} = req.body
    if(!schoolName || !schoolAddress || !schoolEmail || !teacherName || !teacherEmail || !teacherPhone || !studentName || !studentEmail || !studentPhone || !password || !cpassword) errors.push({ msg: "All fields are required" })
    if(password != cpassword) errors.push({ msg: "Passwords do not match" })
    if(errors.length > 0) res.send(errors)
    else{
        User.findOne({ school: {schoolEmail: email} }).then((user) => {
            if (user) {
              req.flash('error', 'User already exists, try logging in instead.')
              return res.redirect('/register')
            }else{
                const newUser = new User({
                    regType: 'school',
                    school:{
                        schoolName,
                        schoolEmail,
                        schoolAddress,
                        clubName,
                        clubEmail,
                        clubWebsite,
                        teacherName,
                        teacherEmail,
                        teacherPhone,
                        studentName,
                        studentEmail,
                        studentPhone,
                        pass:password
                    }
                })
                bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.school.pass, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.school.pass = hash;
                  newUser.save().then((user) => {
                    passport.authenticate('local', (err, user, info) => {
                      if (err) throw err;
                      if (!user) res.send({ "msg": `${info.message}` });
                      else {
                        req.logIn(user, (err) => {
                          console.log(user.school)
                          if (err) throw err;
                          res.render('/login', { msg: "Successfully Authenticated", success: "true", user: req.user });
                        });
                      }
                    })(req, res);
        
                  }).catch((err) => console.log(err));
                })
              );
            }
        })
    }
})

//export router
module.exports = router;