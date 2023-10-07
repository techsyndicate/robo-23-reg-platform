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

//export router
module.exports = router;

