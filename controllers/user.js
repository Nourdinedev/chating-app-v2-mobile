//require models
const User = require("../models/user");

//require passport
const passport = require("passport");
const { findByIdAndUpdate } = require("../models/user");
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

// register and login user and redirect to chat page
module.exports.registerUser = async (req, res) => {
    try {
        const { name, password } = req.body.user
        const emailinput = req.body.user.email;
        const email = emailinput.toLowerCase()
        const user = new User({ name, email })
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

// add user
module.exports.addUser = async (req, res) => {
    const contact = await User.findOne(req.body)
    const user = await User.findById(req.user._id);
    if (contact.email === user.email) {
        return res.redirect("/")
    } else if (!user.contacts.includes(contact._id)) {
        console.log('existed id');
        const addUser = await User.findByIdAndUpdate(req.user._id, { $push: { contacts: contact } })
        console.log(addUser);
        return res.redirect("/")
    }
    res.redirect("/")
}

// logout user
module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect("/")
}