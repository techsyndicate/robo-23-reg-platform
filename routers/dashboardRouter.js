const router = require('express').Router();
const User = require('../schemas/userSchema');


router.get('/',async (req, res) => {

    if(req.user.admin == true) {
        const schoolDetails = await User;
        console.log(schoolDetails)
        return res.render("admin", { user: req.user, schoolDetails });
    }
    else{
        res.render('dashboard', { user: req.user })
    }
});


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



//export router
module.exports = router;