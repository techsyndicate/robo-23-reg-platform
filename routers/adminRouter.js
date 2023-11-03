const router = require('express').Router();
const User = require('../schemas/userSchema');
const teamSchema = require('../schemas/teamSchema');
const json2csv = require("json2csv");


router.get('/', async (req, res) => {
    res.render('admin', { user: req.user })
});

router.get('/schoolData', async (req, res) => {
    let schoolDetails = await User.find({ regType: "school" });
    schoolDetails = await Promise.all(schoolDetails.map((user) => {
        return user.school
    }))
    console.log(schoolDetails)
    return res.render('schoolData', { user: req.user, schools: schoolDetails })
})

router.get('/indiData', async (req, res) => {
    indiDetails = await User.find({ regType: "indi" });
    indiDetails = await Promise.all(indiDetails.map((user) => {
        return user.indi
    }))
    res.render('indiData', { user: req.user, indi: indiDetails })
})

router.post('/indiData/checkin/:id', async (req, res) => {

    var id = req.params.id

    const reqUser = await User.findOne({ regType: "indi", pass: id })

    await User.updateOne({ _id: reqUser._id },
        {
            $set: {
                indi: {
                    firstName: reqUser.indi.firstName,
                    lastName: reqUser.indi.lastName,
                    email: reqUser.indi.email,
                    phone: reqUser.indi.phone,
                    pass: reqUser.indi.pass,
                    discordCode: reqUser.indi.discordCode,
                    dob: reqUser.indi.dob,
                    grade: reqUser.indi.grade,
                    schname: reqUser.indi.schname,
                    checkedIn: true,
                }
            }
        })
    res.redirect('/admin/indiData')
})

router.get('/indiData/:id', async (req, res) => {
    var id = req.params.id
    console.log(id) // sadads
    const toSend = await User.findOne({ regType: "indi", "indi.pass": id})
    const Team = await teamSchema.findOne({ _id: toSend.teamSchemaID })
    console.log(toSend, Team)

    res.render('checkInIndi', { user: toSend.indi, team: Team })
})

router.post('/schoolData/checkin/:id', async (req, res) => {

    var id = req.params.id

    const needUser = await User.findOne({ regType: "school", "school.pass": id })
    console.log(id, needUser)

    await User.updateOne({ _id: needUser._id },
        {
            $set: {
                school: {
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
                }
            }
        }
    ).then(console.log("DOOONE"))
    res.redirect('/admin/schoolData')
})

router.get('/schoolData/:id', async (req, res) => {
    var id = req.params.id
    const School = await User.findOne({ regType: "school", "school.pass": id })
    console.log(id, School)
    const Team = await teamSchema.findOne({ _id: School.teamSchemaID })
    res.render('checkInSchool', { user: School.school, team: Team })
})

router.post('/schoolData/:id/edit', async (req, res) => {
    var id = req.params.id
    const { schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone, checkedIn } = req.body
    // console.log(schoolName, schoolAddress, schoolEmail, clubName, clubEmail, clubWebsite, teacherName, teacherEmail, teacherPhone, studentName, studentEmail, studentPhone )
    const reqUser = await User.findOne({ regType: "school", pass: id })
    // console.log(reqUser)
    await User.updateOne({ _id: reqUser._id },
        {
            $set: {
                school: {
                    schoolName: schoolName,
                    schoolEmail: schoolEmail,
                    schoolAddress: schoolAddress,
                    clubName: clubName,
                    clubEmail: clubEmail,
                    clubWebsite: clubWebsite,
                    teacherName: teacherName,
                    teacherEmail: teacherEmail,
                    teacherPhone: teacherPhone,
                    studentName: studentName,
                    studentEmail: studentEmail,
                    studentPhone: studentPhone,
                    pass: reqUser.pass,
                    checkedIn: checkedIn
                }
            }
        }).then(console.log("HO GAYA"))
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
    const allUsers = await User.find({ regType: "indi" })
    // console.log(allUsers)
    for (var i = 0; i < allUsers.length; i++) {
        // console.log(allUsers[i])
        if (allUsers[i].indi.firstName === id) {
            // console.log(allUsers[i])
            reqUser = allUsers[i]
        }
    }
    console.log(reqUser)
    await User.updateOne({ _id: reqUser._id },
        {
            $set: {
                indi: {
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

router.get("/csv", async (req, res) => {
    const schools = await User.find({ regType: "school"});
    const teams = await teamSchema.find();
    let data = [];
    for (let i = 0; i < schools.length; i++) {
        let school = schools[i]._doc;
        let team = teams.find((team) => team._id == school.teamSchemaID);
        school = JSON.parse(JSON.stringify(school));
        delete school._id;
        delete school.__v;
        if (team) {
            team = team._doc;
            team = JSON.parse(JSON.stringify(team));
            delete team.schId;
            delete team._id;
            delete team.__v;
            delete team.createdAt;
            delete school.createdAt;
            delete team.updatedAt;
            delete school.updatedAt;
            delete school.school.pass;
            data.push({
                discord: school.discordCode,
                code: school.code,
                ...school.school,
                ...team,
            });
        } else {
            data.push({ ...school });
        }
    }
    console.log(data);
    const csv = json2csv.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="robotronics.csv"'
    );
    res.status(200).send(csv);
});

router.get("/csvIndi", async (req, res) => {
    const schools = await User.find({ regType: "indi" });
    const teams = await teamSchema.find();
    let data = [];
    for (let i = 0; i < schools.length; i++) {
        let school = schools[i]._doc;
        let team = teams.find((team) => team._id == school.teamSchemaID);
        school = JSON.parse(JSON.stringify(school));
        delete school._id;
        delete school.__v;
        if (team) {
            team = team._doc;
            team = JSON.parse(JSON.stringify(team));
            delete team.schId;
            delete team._id;
            delete team.__v;
            delete team.createdAt;
            delete school.createdAt;
            delete team.updatedAt;
            delete school.updatedAt;
            delete school.school.pass;
            data.push({
                discord: school.discordCode,
                code: school.code,
                ...school.indi,
                ...team,
            });
        } else {
            data.push({ ...school });
        }
    }
    console.log(data);
    const csv = json2csv.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="robotronics.csv"'
    );
    res.status(200).send(csv);
});

//export router
module.exports = router;

