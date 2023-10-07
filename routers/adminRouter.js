const router = require('express').Router();
const User = require('../schemas/userSchema');
const Team = require('../schemas/teamSchema');

router.get('/',async (req, res) => {
    res.render('admin', { user: req.user })
});


//export router
module.exports = router;