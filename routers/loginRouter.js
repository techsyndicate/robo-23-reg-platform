const router = require('express').Router();
const {loginUser, forwardAuthenticated} = require('../utils/authenticate.js')

router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login', { user: req.user })
});

router.post('/', async (req, res, next) => {
    await loginUser(req, res, next);
})

//export router
module.exports = router;