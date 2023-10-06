const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user })
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            
        }
    })
});
//export router
module.exports = router;