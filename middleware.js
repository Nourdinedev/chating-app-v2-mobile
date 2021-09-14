module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}


module.exports.isCurrentUser = (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return res.redirect("/")
    }
    next()
}