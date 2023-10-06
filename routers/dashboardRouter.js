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



//export router
module.exports = router;