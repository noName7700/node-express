const { Router } = require("express")
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { registerValidators } = require("../utils/validators");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        registerError: req.flash("registerError"),
        loginError: req.flash("loginError"),
    });
});

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login#login");
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const candidate = await User.findOne(email);
    if (candidate) {
        const areSame = await bcrypt.compare(password, candidate.password);
        if (areSame) {
            req.session.user = candidate;
            req.session.isAuthenticated = true;
            req.session.save((err) => {
                if (err) {
                    throw err;
                }
                res.redirect("/");
            });
        } else {
            req.flash("loginError", "Введены неверные email и пароль")
            res.redirect("/auth/login#login");
        }
    } else {
        req.flash("loginError", "Введены неверные email и пароль")
        res.redirect("/auth/login#login");
    }
});

router.post("/register", registerValidators, async (req, res) => {
    const { email, password, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("registerError", errors.array()[0].msg);
        return res.status(422).redirect("/auth/login#register");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User(email, name, hashPassword);
    await user.save();
    res.redirect("/auth/login#login");
});

module.exports = router;