const router = require('express').Router();
const User = require('../schemas/userSchema');
const Team = require('../schemas/teamSchema');
const { ensureAuthenticated } = require('../utils/authenticate.js');

router.get('/', ensureAuthenticated, async (req, res) => {
    res.render('dashboard', { user: req.user })
});

router.get('/team', ensureAuthenticated, async (req, res) => {
    const teamDetails = await Team.findOne({ _id: req.user.teamSchemaID })
    res.render('manageTeams', { user: req.user, team: await teamDetails })
})

//export router
module.exports = router;