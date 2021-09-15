//require models
const User = require("../models/user");

//require passport
const passport = require("passport");
module.exports.login = passport.authenticate('local', { failureRedirect: '/', failureFlash: true })

// render chat page
module.exports.renderUser = async (req, res, next) => {
    const user = req.user
    res.render("chat", { user, title: `${user.name} | Chat Rooms` });
}

// redirect to chat page
module.exports.redirectToUser = async (req, res) => {
    res.redirect(`/user`)
}

// render user profile
module.exports.renderUserProfile = async (req, res) => {
    const user = req.user
    res.render("profile", { user, title: `${user.name} | Profile` }); //using EJS
}

// register and login user and redirect to chat page
module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body.user
        const user = new User({ name, email })
        user.id = user._id;
        const registerUser = await User.register(user, password);
        console.log(user)
        req.login(registerUser, err => {
            if (err) return next(err)
            res.redirect(`/user`)
        })
    } catch (err) {
        req.flash("sign_up_error", "A user with the given email is already registered")
        res.redirect("/")
    }
}

// updating user profile
module.exports.profileUpdate = async (req, res) => {
    const id = req.user._id
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    res.redirect(`/user/profile`)
}


// logout user
module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect("/")
}