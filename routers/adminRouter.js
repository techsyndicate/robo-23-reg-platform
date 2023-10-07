const router = require('express').Router();
const User = require('../schemas/userSchema');
const Team = require('../schemas/teamSchema');

router.get('/',async (req, res) => {
    res.render('admin', { user: req.user })
});

router.get('/schoolData', async (req, res) => {
    const schoolDetails = await User.find({});
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
    res.render('schoolData', {  user: req.user, schools  })
})

router.post('/schoolData/:id', async (req, res) => {
    var id = req.params.id
    console.log(id)
    const allUsers = await User.find({})
    var toSend;
    for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].regType === "school") {
            toSend = allUsers[i].school
        }
        if (allUsers[i].regType === "indi") {
            toSend = allUsers[i].indi
        }
    }
    console.log(toSend)
    // console.log(requiredUser)
    res.render('checkInSchool', {user: toSend})
})

//export router
module.exports = router;

