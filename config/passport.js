const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('./prisma.js');

function initializePassport(passport) { 
    passport.use(
        new LocalStrategy( async (username, password, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { username: username } });
                if (!user) {
                    return done(null, false, { message: "Incorrect username" });
                }
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: id } });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initializePassport;