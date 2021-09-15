module.exports.renderHome = (req, res) => {
    res.render("home", { title: "Chat Rooms" });  //using EJS
}

module.exports.redirectHome = (req, res, next) => {
    res.redirect("/");
}