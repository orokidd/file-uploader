const prisma = require("../config/prisma.js");
const passport = require("passport")
const bcrypt = require("bcrypt")

const getLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render("./auth/login/login");
}

const getRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render("./auth/register/register");
}

const postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.render("./auth/login/login", { 
                error: info?.message,
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
}

const postRegister = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            return res.render("./auth/register/register", { error: "Username already taken" })
        }

        if (password !== confirmPassword) {
            return res.render("./auth/register/register", { error: "Passwords do not match" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                username,
                password: hashedPassword}
        })

        res.redirect("/login")
    } catch (err) {
        console.log(err)
        return res.status(500).render("register", {
            error: "Registration failed. Please try again."
        })
    }
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); 
        res.redirect('/login');
    })
}

module.exports = {
    getLogin,
    getRegister,
    postLogin,
    postRegister,
    logout
}