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
            console.log(schoolDetails[i].school.checkedIn)
        }
        if (schoolDetails[i].regType === "indi") {
            schools.push(schoolDetails[i].indi);
        }
    }
    res.render('schoolData', {  user: req.user, schools})
})

router.get('/indiData', async (req, res) => {

    indiDetails = await User.find({});
    // console.log(schoolDetails)
    var indi = [];
    for (let i = 0; i < indiDetails.length; i++) {
        if (indiDetails[i].regType === "indi") {
            indi.push(indiDetails[i].indi);
        }
    }    
    res.render('indiData', {  user: req.user, indi })
})
router.post('/indiData/checkin/:id', async(req,res) => {
    
    var id = req.params.id

    const allUsers = await User.find({regType: "indi"})

    var reqUser

    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].indi.phone === id) {
            reqUser = allUsers[i]
        }
    }
    console.log(reqUser)
    await User.updateOne({_id: reqUser._id},
        {
            $set:{indi: {
                firstName: reqUser.indi.firstName ,
                lastName: reqUser.indi.lastName ,
                email: reqUser.indi.email ,
                phone: reqUser.indi.phone ,
                pass: reqUser.indi.pass ,
                discordCode: reqUser.indi.discordCode ,
                dob: reqUser.indi.dob ,
                grade: reqUser.indi.grade ,
                schname: reqUser.indi.schname ,
                checkedIn: true,
            }}
    }).then(console.log("DOOONE"))
    res.redirect('/admin/indiData')
})
router.post('/indiData/:id', async (req, res) => {
    var id = req.params.id
    console.log(id) // sadads
    const allUsers = await User.find({regType: "indi"})
    var toSend;
    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].indi.firstName === id) {
            toSend = allUsers[i].indi
        }
    }
    // console.log(toSend)
    // console.log(requiredUser)
    res.render('checkInIndi', {user: toSend})
})

router.post('/schoolData/checkin/:id', async(req,res) => {
    
    var id = req.params.id

    const allUsers = await User.find({regType: "school"})

    var needUser

    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].school.schoolName === id) {
            needUser = allUsers[i]
        }
    }
    
    await User.updateOne({_id: needUser._id},
        {
            $set:{ school:{
                schoolName: needUser.school.schoolName,
                schoolAddress: needUser.school.schoolAddress,
                schoolEmail: needUser.school.schoolEmail,
                clubName: needUser.school.clubName,
                clubEmail: needUser.school.clubEmail,
                clubWebsite: needUser.school.clubWebsite,
                teacherName: needUser.school.teacherName,
                teacherEmail: needUser.school.teacherEmail,
                teacherPhone: needUser.school.teacherPhone,
                studentName: needUser.school.studentName,
                studentEmail: needUser.school.studentEmail,
                studentPhone: needUser.school.studentPhone,
                pass: needUser.school.pass,
                checkedIn: true,
            }}
        }
    ).then(console.log("DOOONE"))
    res.redirect('/admin/schoolData')
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
    // console.log(toSend)
    // console.log(requiredUser)
    res.render('checkInSchool', {user: toSend})
})

router.post('/schoolData/:id/edit', async (req,res) => {
    var id = req.params.id
    const { schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone, checkedIn } = req.body
    // console.log(schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone )
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
    await User.updateOne({_id: reqUser._id},
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
            studentPhone: studentPhone,
            pass: reqUser.pass,
            checkedIn: checkedIn
        }}
    }).then(console.log("HO GAYA"))
    console.log(await User.findOne({schoolName: schoolName}))
    res.redirect('/admin/schoolData')
})

router.post('/indiData/:id/edit', async (req, res) => {
    var id = req.params.id
    const { firstName,
        lastName,
        email,
        dob,
        grade,
        phone,
        schname,
        checkedIn
    } = req.body
    
    var reqUser;
    const allUsers = await User.find({regType: "indi"})
    // console.log(allUsers)
    for (var i = 0; i < allUsers.length; i++) {
        // console.log(allUsers[i])
        if (allUsers[i].indi.firstName === id) {
            // console.log(allUsers[i])
            reqUser = allUsers[i]
        }
    }
    console.log(reqUser)
    await User.updateOne({_id: reqUser._id},
    {
        $set: {indi:{
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            dob: dob,
            grade: grade,
            schname: schname,
            pass: reqUser.pass,
            checkedIn: checkedIn
        }
    }
    }).then(console.log("HO GAYA"))
    res.redirect('/admin/indiData')
})

//export router
module.exports = router;

