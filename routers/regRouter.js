const router = require('express').Router();

router.get('/school', (req, res) => {
    res.render('schoolReg', { user: req.user })
});

router.get('/indi', (req, res) => {
    res.render('indiReg', { user: req.user })
});

//export router
module.exports = router;