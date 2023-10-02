const router = require('express').Router();
const {ensureAuthenticated, forwardAuthenticated} = require('../middleware/authenticate.js')
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login', { user: req.user })
});

//export router
module.exports = router;