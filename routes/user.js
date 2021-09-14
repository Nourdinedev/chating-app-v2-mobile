const express = require("express");
const router = express.Router()

//require passport
const passport = require("passport");

//require models
const User = require("../models/user");

// Joi valedation
const UserValidation = require("../schemas")

//require Utils
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

//require middlewares
const { isLoggedIn, isCurrentUser } = require("../middleware")

//user routes
router.post("/sign-up", UserValidation, catchAsync(async (req, res) => {
    try {
        const { name, email, password } = req.body.user
        const user = new User({ name, email })
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err)
            res.redirect(`/user/${user._id}`)
        })
    } catch (err) {
        req.flash("sign_up_error", "A user with the given email is already registered")
        res.redirect("/")
    }
}));

router.post("/sign-in", passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), catchAsync(async (req, res) => {
    res.redirect(`/user/${req.user._id}`)
}));

router.get("/sign-out", (req, res) => {
    req.logout()
    res.redirect("/")
});


router.get("/:id", isLoggedIn, catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) throw new ExpressError("User not found", 404)
    res.render("chat", { user, title: `${user.name} | Chat Rooms` });
}));

router.get("/:id/profile", isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id,)
    res.render("profile", { user, title: `${user.name} | Profile` }); //using EJS
}));

router.put("/:id/profile", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    res.redirect(`/user/${user._id}/profile`)
}));



module.exports = router


// to store the url that the user want to 
// access befor we redirect him to the login page
// we save the url in the session 
// storedURL is the name we chose to store the url under
// we add this to the redirecting route
// req.sission.storedURL = req.originalUrl
// and we add the req.sission.storedURL value to the redirected route
// const = redirectUrl = req.sission.storedURL \\ "/campground"
// we add defult route in case thir is no storedURL
// and we redirect to redirectUrl