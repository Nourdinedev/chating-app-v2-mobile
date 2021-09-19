const express = require("express");
const router = express.Router()

// Joi valedation
const UserValidation = require("../schemas")

//require Controllers
const UserControllers = require("../controllers/user")

//require Utils
const catchAsync = require("../utils/catchAsync")

//require middlewares
const { isLoggedIn, toLowercase } = require("../middleware")

//user routes
router.post("/sign-up", UserValidation, catchAsync(UserControllers.registerUser));

router.post("/sign-in", toLowercase, UserControllers.login, catchAsync(UserControllers.redirectToUser));

router.get("/", isLoggedIn, catchAsync(UserControllers.renderUser));

router.patch("/", toLowercase, UserControllers.addUser)

router.get("/sign-out", UserControllers.logoutUser);

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