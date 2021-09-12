const express = require("express");
const router = express.Router()



//home routes
router.get("/", (req, res) => {
    req.flash("success", "success flash test")
    req.flash("error", "error flash test")
    res.render("home", { title: "Chat Rooms" });  //using EJS

});

//404 route
router.all("/*", (req, res, next) => {
    throw new ExpressError("Page Not Found", 404)
});


module.exports = router