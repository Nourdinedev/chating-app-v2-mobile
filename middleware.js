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


module.exports.toLowercase = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase()
    next()
}




