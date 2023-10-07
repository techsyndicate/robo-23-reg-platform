const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('schoolData', { user: req.user })
});

//export router
module.exports = router;