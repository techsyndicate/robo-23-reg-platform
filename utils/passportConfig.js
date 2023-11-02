const passportLocal = require('passport-local'),
    LocalStrategy = (passportLocal.Strategy),
    bcrypt = require('bcrypt'),
    User = require('../schemas/userSchema.js');

module.exports = function passportInit(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'schoolEmail', passwordField: 'password' },
            async (email, password, done) => {
                const user = await User.findOne({ "school.schoolEmail": email }) || await User.findOne({ "indi.email": email }) || await User.findOne({ "school.clubEmail": email });
                console.log(user)
                if (!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }
                console.log(user.school.pass || user.indi.pass)
                if (user.school.pass || user.indi.pass === undefined) {
                    return done(null, user);
                }
                bcrypt.compare(password, user.school.pass || user.indi.pass, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                });
            })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            res.send(err)
        }
    }); 
}