const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");



//home routes
router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect(`/user/${req.user._id}`)
    }
    res.render("home", { title: "Chat Rooms" });  //using EJS

});

//404 route
router.all("/*", (req, res, next) => {
    if (req.user) {
        return res.redirect(`/user/${req.user._id}`) //user added to the req object automatically by passport if the user is logged-in
    }
    res.redirect("/")
});


module.exports = router