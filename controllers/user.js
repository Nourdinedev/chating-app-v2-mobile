//require models
const User = require("../models/user");

//require passport
const passport = require("passport");
module.exports.login = passport.authenticate('local', { failureRedirect: '/', failureFlash: true })

// render chat page
module.exports.renderUser = async (req, res) => {
    const user = req.user
    if (req.user.contacts.length) {
        const contacts = await User.find(...req.user.contacts)
        const ConversationContact = {
            email: '',
            name: ''
        }
        res.render("chat", { user, contacts, ConversationContact, title: `${user.name} | Chat Rooms` });
    } else {
        const contacts = []
        const ConversationContact = {
            email: '',
            name: ''
        }
        res.render("chat", { user, contacts, ConversationContact, title: `${user.name} | Chat Rooms` });
    }
}

// render chat page of a contact
module.exports.renderConversation = async (req, res) => {
    const user = req.user
    if (req.user.contacts.length) {
        const contacts = await User.find(...req.user.contacts)
        const { id } = req.params
        const ConversationContact = await User.findById(id);
        res.render("chat", { user, contacts, ConversationContact, title: `${user.name} | Chat Rooms` });
    } else {
        const contacts = []
        const { id } = req.params
        const ConversationContact = await User.findById(id);
        res.render("chat", { user, contacts, ConversationContact, title: `${user.name} | Chat Rooms` });
    }
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
    const contact = await User.findOne(req.body);
    const user = await User.findById(req.user._id);
    if (contact.email === user.email) {
        req.flash("add_user_error", "You can not add your self to your contacts");
        return res.redirect("/")
    } else if (user.contacts.includes(contact._id)) {
        req.flash("add_user_error", "User is already Added to your contacts");
        return res.redirect("/")
    }
    const addUser = await User.findByIdAndUpdate(req.user._id, { $push: { contacts: contactUser } });
    req.flash("add_user_error", `${contact.name} added to your contacts`);
    console.log(addUser);
    res.redirect("/")
}

// logout user
module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect("/")
}