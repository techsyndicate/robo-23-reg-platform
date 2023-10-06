const router = require('express').Router()
const User = require('../schemas/userSchema.js')
const bcrypt = require('bcrypt')
const { loginUser, forwardAuthenticated } = require('../utils/authenticate.js')
const { teamCreateHandle } = require('../utils/discordBot.js')
const otpGenerator = require('otp-generator')
const 

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
      console.log(user, "already exists")
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
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(newUser.school.pass, salt, async (err, hash) => {
      if (err) throw err;
      newUser.school.pass = hash;
      await newUser.save().then((user) => {
        console.log(user)
      }).catch(err => console.log(err))
      await loginUser(req, res, next)
      sendMail(schoolEmail, "Robo reg", "", await renderFile("views/reg-email.ejs", { token: "zbjvyr13rtd" }))
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
      console.log(user, "already exists")
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
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(newUser.indi.pass, salt, async (err, hash) => {
      if (err) throw err;
      newUser.indi.pass = hash;
      await newUser.save().then(async (user) => {
        console.log(user)
        let mailDetails = {
          from: process.env.FROM_EMAIL,
          to:  newUser.email,
          subject: "Registration for Robotronics 2023",
          html: await renderFile("views/reg-email.ejs", {
            userId,
            pass: pass,
            token,
          }),
        };
        
        await mailTransporter.sendMail(mailDetails, function (err, data) {
          if (err) {
            SendError(err);
            console.log(err);
        
            return res.status(500).send("Some error occurred");
          } else {
            console.log("Email sent successfully");
            console.log("Registration Successful");
            return res.status(200).send({ status: 200, msg: "Registered" });
          }
        });
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