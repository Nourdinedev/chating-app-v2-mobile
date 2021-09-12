const express = require("express");
const router = express.Router()

//require models
const User = require("../models/user");

// Joi valedation
const UserValidation = require("../schemas")

//require Utils
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

//user routes
router.post("/sign-up", UserValidation, catchAsync(async (req, res) => {
    // if (!req.body.user) throw new ExpressError("Invalid user data", 400)

    const user = new User(req.body.user)
    await user.save();
    res.redirect(`/user/${user._id}`);
}));

router.post("/sign-in", catchAsync(async (req, res) => {
    const user = await User.findOne({ email: req.body.user.email })
    if (req.body.user.password !== user.password) {
        return res.redirect("/sign")
    }
    res.redirect(`/user/${user._id}`)
}));

router.get("/:id", catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id,)
    if (!user) throw new ExpressError("User not found", 404)
    res.render("chat", { user, title: `${user.name} | Chat Rooms` });
}));

router.get("/:id/profile", catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id,)
    res.render("profile", { user, title: `${user.name} | Profile` }); //using EJS
    // if (!user) {
    //    return res.render("404", { title: "Page not found 404" });
    // }
}));

router.put("/:id/profile", catchAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    res.redirect(`/user/profile/${user._id}`)
}));



module.exports = router