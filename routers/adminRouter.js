const router = require('express').Router();
const User = require('../schemas/userSchema');

router.get('/schoolData', async (req, res) => {
    const schoolDetails = await User.find({});
    // console.log(schoolDetails)
    var schools = [];
    for (let i = 0; i < schoolDetails.length; i++) {
        if (schoolDetails[i].regType === "school") {
            schools.push(schoolDetails[i].school);
        }
    }
    console.log(schools)
    res.render('schoolData', {  user: req.user, schools  })
})