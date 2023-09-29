const router = require('express').Router();
const Register = require('../schemas/teamSchema');


// let thisiscode 
let a
let final


router.get('/register', async (req, res) => {
    res.render('login');
    // thisiscode = schidSchema.find();
});

router.post('/register', async (req, res) => {
    try {
        const newReg = new Register({
            schId: req.body.schId,
            schName: req.body.schName,
            creativeparticipant1: req.body.creativeparticipant1,
            creativeparticipant2: req.body.creativeparticipant2,
            creativeparticipant3: req.body.creativeparticipant3,
            creativeparticipant4: req.body.creativeparticipant4,
            creativeparticipant5: req.body.creativeparticipant5,
            creativeparticipant6: req.body.creativeparticipant6,
            crossparticipant1: req.body.crossparticipant1,
            crossparticipant2: req.body.crossparticipant2,
            gdparticipant1: req.body.gdparticipant1,
            surpparticipant1: req.body.surpparticipant1,
            surpparticipant2: req.body.surpparticipant2,
            progparticipant1: req.body.progparticipant1,
            progparticipant2: req.body.progparticipant2,
            filmparticipant1: req.body.filmparticipant1,
            filmparticipant2: req.body.filmparticipant2,
            filmparticipant3: req.body.filmparticipant3,
            filmparticipant4: req.body.filmparticipant4,
            gamingparticipant1: req.body.gamingparticipant1,
            gamingparticipant2: req.body.gamingparticipant2,
            quizparticipant1: req.body.quizparticipant1,
            roboticsparticipant1: req.body.roboticsparticipant1,
            roboticsparticipant2: req.body.roboticsparticipant2,
            roboticsparticipant3: req.body.roboticsparticipant3,
            photoparticipant1: req.body.photoparticipant1,
            paintparticipant1: req.body.paintparticipant1,
            gamedevparticipant1: req.body.gamedevparticipant1,
            gamedevparticipant2: req.body.gamedevparticipant2,
            minecraftparticipant1: req.body.minecraftparticipant1,
            minecraftparticipant2: req.body.minecraftparticipant2,
            schCode: Math.floor((Math.random() * 100) + 1)
        });

        await newReg.save();
        return res.render("schoolcode.ejs", {code_: newReg})
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//export router
module.exports = router;