//require models
const User = require("../models/user");
const Conversation = require("../models/conversation")

//require passport
const passport = require("passport");
const conversation = require("../models/conversation");
module.exports.login = passport.authenticate('local', { failureRedirect: '/', failureFlash: true })

// render chat page
module.exports.renderUser = async (req, res) => {
    const user = await User.findById(req.user.id)
    const contact = await User.findById(req.params.id)
    const findconversation = await Conversation.findOne({ participants: [req.user.email, contact] })
    const findconversation2 = await Conversation.findOne({ participants: [contact, req.user.email] })
    if (user.contacts.length) {

        const ConversationContact = {
            email: '',
            name: ''
        }
        res.render("chat", { user, findconversation, findconversation2, ConversationContact, title: `${user.name} | Chat Rooms` });
    } else {

        const ConversationContact = {
            email: '',
            name: ''
        }
        res.render("chat", { user, findconversation, findconversation2, ConversationContact, title: `${user.name} | Chat Rooms` });
    }
}

// render chat page of a contact
module.exports.renderConversation = async (req, res) => {
    const currentUser = await User.findById(req.user.id)
    const user = req.user
    const contact = await User.findById(req.params.id)
    if (!contact) {
        return res.redirect(`/user`)
    }

    const findconversation = await Conversation.findOne({ participants: [currentUser.email, contact.email] })
    const findconversation2 = await Conversation.findOne({ participants: [contact.email, currentUser.email] })

    if (!findconversation && !findconversation2) {
        const conversation = new Conversation()
        conversation.participants.push(currentUser.email, contact.email)
        await conversation.save()
    }

    if (currentUser.contacts.length) {
        const { id } = req.params
        const ConversationContact = await User.findById(id);
        res.render("chat", { user, contact, currentUser, findconversation, findconversation2, ConversationContact, title: `${user.name} | Chat Rooms` });
    } else {
        const { id } = req.params
        const ConversationContact = await User.findById(id);
        const addUserToConverstion = await User.findByIdAndUpdate(user._id, { $push: { contacts: contact } });
        res.render("chat", { user, contact, currentUser, findconversation, findconversation2, ConversationContact, title: `${user.name} | Chat Rooms` });
    }
}

// send message
module.exports.sendMessage = async (req, res) => {
    const user = await User.findById(req.user.id)
    const contact = await User.findById(req.params.id)
    const message = req.body.message
    const findconversation = await Conversation.findOne({ participants: [user.email, contact.email] })
    const findconversation2 = await Conversation.findOne({ participants: [contact.email, user.email] })
    if (!contact) {
        return res.redirect(`/user`)
    }
    if (message === "") {
        return res.redirect(`/user/${contact._id}`)
    }
    if (!findconversation && !findconversation2) {
        const conversation = new Conversation()
        conversation.participants.push(user.email, contact.email)
        await conversation.save()
    }
    if (findconversation) {
        const conversation = await Conversation.findByIdAndUpdate(findconversation._id, { $push: { messages: { author: { _id: contact._id, name: contact.name, email: contact.email }, body: message, timestamp: Date.now() } } })
        console.log(conversation);
        const updateUser = await User.updateOne({ _id: user._id, contacts: { $elemMatch: { email: `${contact.email}`, _id: `${contact._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })
        const updateContact = await User.updateOne({ _id: req.params.id, contacts: { $elemMatch: { email: `${user.email}`, _id: `${user._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })
        console.log(updateUser);
        console.log(updateContact);

        if (contact.email === user.email) {
            req.flash("add_user_error", "You can not add your self to your contacts");
            return res.redirect(`/user/${contact._id}`)
        }

        if (contact.contacts.filter(e => e.email === user.email).length > 0) {
            req.flash("add_user_error", "User is already Added to your contacts");
            return res.redirect(`/user/${contact._id}`)
        }

        const addUser = await User.findByIdAndUpdate(contact._id, { $push: { contacts: { _id: user._id, name: user.name, email: user.email, lastMessage: "" } } });
        req.flash("add_user_success", `${contact.name} added to your contacts`);
        console.log(addUser);
        return res.redirect(`/user/${contact._id}`)

    } else if (findconversation2) {
        const conversation = await Conversation.findByIdAndUpdate(findconversation2._id, { $push: { messages: { author: { _id: contact._id, name: contact.name, email: contact.email }, body: message, timestamp: Date.now() } } })
        console.log(conversation);

        const updateUser = await User.updateOne({ _id: user._id, contacts: { $elemMatch: { email: `${contact.email}`, _id: `${contact._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })
        const updateContact = await User.updateOne({ _id: req.params.id, contacts: { $elemMatch: { email: `${user.email}`, _id: `${user._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })
        console.log(updateUser);
        console.log(updateContact);

        if (contact.email === user.email) {
            req.flash("add_user_error", "You can not add your self to your contacts");
            return res.redirect(`/user/${contact._id}`)
        }

        if (contact.contacts.filter(e => e.email === user.email).length > 0) {
            req.flash("add_user_error", "User is already Added to your contacts");
            return res.redirect(`/user/${contact._id}`)
        }

        const addUser = await User.findByIdAndUpdate(contact._id, { $push: { contacts: { _id: user._id, name: user.name, email: user.email, lastMessage: "" } } });
        req.flash("add_user_success", `${contact.name} added to your contacts`);
        console.log(addUser);
        return res.redirect(`/user/${contact._id}`)
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
        console.log(user);
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
    }

    if (user.contacts.filter(e => e.email === contact.email).length > 0) {
        req.flash("add_user_error", "User is already Added to your contacts");
        return res.redirect("/")
    }

    const addUser = await User.findByIdAndUpdate(user._id, { $push: { contacts: { _id: contact._id, name: contact.name, email: contact.email, lastMessage: "" } } });
    req.flash("add_user_success", `${contact.name} added to your contacts`);
    console.log(addUser);
    res.redirect("/")
}

// logout user
module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect("/")
}