const express = require("express");
const router = express.Router();
const { isLoggedOut } = require("../middleware")

//require Controllers
const HomeControllers = require("../controllers/home")

//home routes
router.get("/", isLoggedOut, HomeControllers.renderHome);

//404 route
router.all("/*", isLoggedOut, HomeControllers.redirectHome);


module.exports = router