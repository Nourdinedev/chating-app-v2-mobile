module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

module.exports.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/user`)
    }
    next()
}





