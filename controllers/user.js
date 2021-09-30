//require models
const User = require("../models/user");
const Conversation = require("../models/conversation")

//require passport
const passport = require("passport");
const conversation = require("../models/conversation");
module.exports.login = passport.authenticate('local', { failureRedirect: '/', failureFlash: true })

// register and login user and redirect to chat page
module.exports.registerUser = async (req, res) => {
    try {
        const { name, password } = req.body.user
        const emailinput = req.body.user.email;
        const email = emailinput.toLowerCase()
        const user = new User({ name, email })
        const registerUser = await User.register(user, password);
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
    const user = await User.findById(req.user.id);

    if (!contact) {
        req.flash("add_user_error", "Contact not found");
        return res.redirect("/")
    }

    if (contact.email === user.email) {
        req.flash("add_user_error", "You can not add your self to your contacts");
        return res.redirect("/")
    }

    if (user.contacts.filter(e => e.email === contact.email).length > 0) {
        req.flash("add_user_error", "User is already Added to your contacts");
        return res.redirect("/")
    }

    const participants = [
        {
            ' _id': `${user._id}`,
            'email': `${user.email}`
        },
        {
            ' _id': `${contact._id}`,
            'email': `${contact.email}`
        }
    ]
    const conversation = new Conversation({ participants })
    await conversation.save()

    const addUser = await User.findByIdAndUpdate(user._id, { $push: { contacts: { _id: contact._id, name: contact.name, email: contact.email, lastMessage: "", conversation: conversation._id } } });
    req.flash("add_user_success", `${contact.name} added to your contacts`);
    res.redirect("/")
}

// render chat page
module.exports.renderUser = async (req, res) => {
    const user = await User.findById(req.user.id)
    const findconversation = await Conversation.findById(req.params.id)

    const changeState = async (state) => {
        const userState = await User.findByIdAndUpdate(user._id, { isOnline: state })
        userState.contacts.forEach(async contact => {
            const updateContact = await User.updateOne({ _id: contact._id, contacts: { $elemMatch: { email: `${user.email}`, _id: `${user._id}` } } }, { $set: { "contacts.$.isOnline": state } })
        })
    }

    res.render("user", { user, findconversation, title: `${user.name} | Chat Rooms` });
}


// render chat page of a contact
module.exports.renderConversation = async (req, res) => {
    const currentUser = await User.findById(req.user._id)
    const user = req.user

    const findconversation = await Conversation.findById(req.params.id)
    const participants = (findconversation.participants)

    participants.forEach(participant => {
        if (participant.email !== user.email) return contactEmail = participant.email
    })

    const contact = await User.findOne({ email: contactEmail })
    const ConversationContact = contact

    if (!findconversation) {
        return res.redirect(`/user`)
    }
    res.render("conversation", { user, findconversation, contact, ConversationContact, currentUser, title: `${user.name} | Chat Rooms` });
}

// redirect to chat page
module.exports.redirectToUser = async (req, res) => {
    res.redirect(`/user`)
}

// send message
module.exports.sendMessage = async (req, res) => {
    const user = await User.findById(req.user.id)
    const message = req.body.message
    const findconversation = await Conversation.findById(req.params.id)

    const participants = (findconversation.participants)
    participants.forEach(participant => {
        if (participant.email !== user.email) return contactEmail = participant.email
    })
    const contact = await User.findOne({ email: contactEmail })
    const ConversationContact = await User.findOne({ email: contactEmail })
    const room = req.params.id

    if (message === "") {
        return res.redirect(`/user/${findconversation._id}`)
    }

    if (!findconversation) {
        return res.redirect(`/user`)
    }

    if (!contact) {
        return res.redirect(`/user`)
    }

    const conversation = await Conversation.findByIdAndUpdate(findconversation._id, { $push: { messages: { author: { _id: contact._id, name: contact.name, email: contact.email }, body: message, timestamp: Date.now() } } })
    const updateUser = await User.updateOne({ _id: user._id, contacts: { $elemMatch: { email: `${contact.email}`, _id: `${contact._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })
    const updateContact = await User.updateOne({ _id: contact._id, contacts: { $elemMatch: { email: `${user.email}`, _id: `${user._id}` } } }, { $set: { "contacts.$.lastMessage": `${message}` } })

    if (contact.email === user.email) {
        req.flash("add_user_error", "You can not add your self to your contacts");
        return res.redirect(`/user/${findconversation._id}`)
    }
    if (contact.contacts.filter(e => e.email === user.email).length > 0) {
        req.flash("add_user_error", "User is already Added to your contacts");
        return res.redirect(`/user/${findconversation._id}`)
    }
    const addUser = await User.findByIdAndUpdate(contact._id, { $push: { contacts: { _id: user._id, name: user.name, email: user.email, lastMessage: message, conversation: conversation._id } } });
    req.flash("add_user_success", `${contact.name} added to your contacts`);
    return res.redirect(`/user/${findconversation._id}`)
}

// logout user
module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect("/")
}