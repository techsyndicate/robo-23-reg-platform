const router = require('express').Router()
const User = require('../schemas/userSchema.js')
const bcrypt = require('bcrypt')
const { loginUser, forwardAuthenticated } = require('../utils/authenticate.js')
const { teamCreateHandle } = require('../utils/discordBot.js')
const otpGenerator = require('otp-generator')
const ejs = require('ejs')
const { sendMail } = require('../utils/mailHelper.js')
const teamSchema = require('../schemas/teamSchema.js')

router.get('/school', forwardAuthenticated, (req, res) => {
  res.render('schoolReg', { user: req.user })
});

router.get('/indi', forwardAuthenticated, (req, res) => {
  res.render('indiReg', { user: req.user })
});

router.post('/school', async (req, res, next) => {
  let discordCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  let errors = []
  const { schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone, password, cpassword } = req.body
  if (!schoolName || !schoolAddress || !schoolEmail || !teacherName || !teacherEmail || !teacherPhone || !studentName || !studentEmail || !studentPhone || !password || !cpassword) errors.push({ msg: "All fields are required" })
  if (password != cpassword) errors.push({ msg: "Passwords do not match" })
  await User.findOne({ "school.schoolEmail": schoolEmail }).then((user) => {
    if (user) {
      errors.push({ msg: "Account already exists, try logging in" })
    }
  })

  if (errors.length > 0) return res.send(errors)
  const newUser = new User({
    regType: 'school',
    school: {
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
      pass: password
    },
    discordCode

  })
  const team = new teamSchema({

  })
  team.save()
  newUser.teamSchemaID = team._id
  bcrypt.genSalt(10, async (err, salt) =>
    bcrypt.hash(newUser.school.pass, salt, async (err, hash) => {
      if (err) throw err;
      newUser.school.pass = hash;
      newUser.school.schoolName = newUser.school.schoolName.replace(/[^a-zA-Z ]/g, "");
      teamCreateHandle(newUser.school.schoolName)
      await newUser.save().then(async (user) => {
        console.log(user)
        discoIt(JSON.stringify(user))
        sendMail(schoolEmail, "Registration for Robotronics 2023", "", await ejs.renderFile(__dirname + "/../views/reg-email.ejs", { userId : schoolEmail, pass: password, token: discordCode }))
        sendMail(clubEmail, "Registration for Robotronics 2023", "", await ejs.renderFile(__dirname + "/../views/reg-email.ejs", { userId: schoolEmail, pass: password, token: discordCode }))
        sendMail(teacherEmail, "Registration for Robotronics 2023", "", await ejs.renderFile(__dirname + "/../views/reg-email.ejs", { userId: schoolEmail, pass: password, token: discordCode }))
      }).catch(err => discoIt(JSON.stringify(err)))
      await loginUser(req, res, next)
    })
  );

})

router.post('/indi', async (req, res, next) => {
  let discordCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  let errors = []
  const { name,
    email,
    dob,
    grade,
    phone,
    school,
    password,
    cpassword
  } = req.body
  if (!name || !email || !dob || !grade || !phone || !school || !password || !cpassword) errors.push({ msg: "All fields are required" })
  if (password != cpassword) errors.push({ msg: "Passwords do not match" })
  await User.findOne({ "indi.email": email }).then((user) => {
    if (user) {
      errors.push({ msg: "Account already exists, try logging in" })
    }
  })

  if (errors.length > 0) return res.send(errors)
  const newUser = new User({
    regType: 'indi',
    indi: {
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1],
      email: email,
      phone: phone,
      dob: dob,
      grade: grade,
      schname: school,
      pass: password
    },
    discordCode
  })
  const team = new teamSchema({

  })
  team.save()
  newUser.teamSchemaID = team._id
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(newUser.indi.pass, salt, async (err, hash) => {
      if (err) throw err;
      newUser.indi.pass = hash;
      teamCreateHandle(newUser.indi.firstName)

      await newUser.save().then(async (user) => {
        console.log(user)
        discoIt(JSON.stringify(user))
        sendMail(email, "Registration for Robotronics 2023", "",await ejs.renderFile(__dirname + "/../views/inviteMail.ejs"))
      }).catch(err => console.log(err))
      req.body.schoolEmail = email
      await loginUser(req, res, next)
    })
  );

  
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

//export router
module.exports = router;