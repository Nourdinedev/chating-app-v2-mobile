// require express
const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');

// require path
const path = require("path");

// set up socket
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

// require mongoose
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/chat-app";

//require Utils
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")

// Joi valedation
const UserValidation = require("./schemas")


//require method override
const methodOverride = require("method-override")

//require models
const User = require("./models/user");

// connect to DB
mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
});

// check DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
   console.log("Database connected");
});


app.set("views", __dirname + "/views"); //for using EJS
app.set("view engine", "ejs"); //for using EJS
app.use(expressLayouts);


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

//Join paths
app.use(express.static(path.join(__dirname, "dist")));

//routes
app.get("/", (req, res) => {
   res.render("home", { title: "Chat Rooms" });  //using EJS

});

app.post("/sign-up", UserValidation, catchAsync(async (req, res) => {
   // if (!req.body.user) throw new ExpressError("Invalid user data", 400)

   const user = new User(req.body.user)
   await user.save();
   res.redirect(`user/${user._id}`)
}));

app.post("/sign-in", catchAsync(async (req, res) => {
   const user = await User.findOne({ email: req.body.user.email })
   if (req.body.user.password !== user.password) {
      return res.redirect("/sign")
   }
   res.redirect(`user/${user._id}`)
}));

app.get("/user/:id", catchAsync(async (req, res, next) => {
   const user = await User.findById(req.params.id,)
   if (!user) throw new ExpressError("User not found", 404)
   res.render("chat", { user, title: `${user.name} | Chat Rooms` });
}));

app.get("/user/:id/profile", catchAsync(async (req, res) => {
   const user = await User.findById(req.params.id,)
   res.render("profile", { user, title: `${user.name} | Profile` }); //using EJS
   // if (!user) {
   //    return res.render("404", { title: "Page not found 404" });
   // }
}));

app.put("/user/:id/profile", catchAsync(async (req, res) => {
   const { id } = req.params
   const user = await User.findByIdAndUpdate(id, { ...req.body.user })
   res.redirect(`profile/${user._id}`)
}));

app.all("/*", (req, res, next) => {
   throw new ExpressError("Page Not Found", 404)
});

app.use((err, req, res, next) => {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = "Oops, Somthing went wrong";
   res.status(statusCode).render("error", { err, title: "Oops | Somthing went wrong" })
   // return res.render("404", { title: "Page not found 404" });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}`));
