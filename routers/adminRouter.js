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
    schoolDetails = await User.find({});
    // console.log(schoolDetails)
    var schools = [];
    for (let i = 0; i < schoolDetails.length; i++) {
        if (schoolDetails[i].regType === "school") {
            schools.push(schoolDetails[i].school);
            console.log(schoolDetails[i].school.checkedIn)
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

//export router
module.exports = router;

