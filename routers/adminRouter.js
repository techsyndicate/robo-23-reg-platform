const router = require('express').Router();
const User = require('../schemas/userSchema');
const Team = require('../schemas/teamSchema');

let indiDetails
let schoolDetails
let checkIn = false


router.get('/',async (req, res) => {
    res.render('admin', { user: req.user })
});

router.get('/schoolData', async (req, res) => {
    if(req.user.checkedIn){
        checkIn = true
    }
    else{
        checkIn = false
    }
    schoolDetails = await User.find({});
    // console.log(schoolDetails)
    var schools = [];
    for (let i = 0; i < schoolDetails.length; i++) {
        if (schoolDetails[i].regType === "school") {
            schools.push(schoolDetails[i].school);
        }
        if (schoolDetails[i].regType === "indi") {
            schools.push(schoolDetails[i].indi);
        }
    }
    // console.log(schoolDetails)
    console.log(schools)
    res.render('schoolData', {  user: req.user, schools, checkIn: checkIn  })
})

router.get('/indiData', async (req, res) => {

    if(req.user.checkedIn){
        checkIn = true
    }
    else{
        checkIn = false
    }

    indiDetails = await User.find({});
    // console.log(schoolDetails)
    var indi = [];
    for (let i = 0; i < indiDetails.length; i++) {
        if (indiDetails[i].regType === "indi") {
            indi.push(indiDetails[i].indi);
        }
    }
    console.log(indi)
    res.render('indiData', {  user: req.user, indi, checkIn: checkIn  })
})

router.get('/checkin', (req,res) => {
    req.user.checkedIn = true;
    req.user.save();
    res.redirect('/admin');
})

router.post('/schoolData/:id', async (req, res) => {
    var id = req.params.id
    console.log(id) // sadads
    const allUsers = await User.find({regType: "school"})
    var toSend;
    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].school.schoolName === id) {
            toSend = allUsers[i].school
        }
    }
    console.log(toSend)
    // console.log(requiredUser)
    res.render('checkInSchool', {user: toSend})
})

router.post('/schoolData/:id/edit', async (req,res) => {
    var id = req.params.id
    const { schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone } = req.body
    console.log(schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone )
    var reqUser;
    const allUsers = await User.find({regType: "school"})
    // console.log(allUsers)
    for (var i = 0; i < allUsers.length; i++) {
        // console.log(allUsers[i])
        if (allUsers[i].school.schoolName === id) {
            reqUser = allUsers[i]
        }
    }
    // console.log(reqUser)
    await User.updateOne(reqUser,
    {
        $set: {school:{
            schoolName: schoolName,
            schoolEmail: schoolEmail,
            schoolAddress: schoolAddress,
            clubName: clubName,
            clubEmail: clubEmail,
            clubWebsite: clubWebsite,
            teacherName: teacherName,
            teacherEmail:  teacherEmail,
            teacherPhone: teacherPhone,
            studentName: studentName,
            studentEmail: studentEmail,
            studentPhone: studentPhone
        }}
    }).then(console.log("HO GAYA"))
    res.redirect('/admin/schoolData')
})

//export router
module.exports = router;

