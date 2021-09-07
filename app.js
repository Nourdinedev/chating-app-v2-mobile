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

app.get("/sign", async (req, res) => {
   res.render("sign", { title: "sign in | sign up" }); //using EJS
});

app.post("/sign-in", async (req, res) => {
   const user = new User(req.body.user)
   await user.save();
   res.redirect(`user/${user._id}`)
});

app.post("/sign-up", async (req, res) => {
   const user = await User.findOne({ email: req.body.user.email })
   if (req.body.user.password !== user.password) {
      return res.redirect("/sign")
   }
   res.redirect(`user/${user._id}`)
});

app.get("/user/:id", async (req, res) => {
   try {
      const user = await User.findById(req.params.id,)
      res.render("chat", { user, title: `${user.name} | Chat Rooms` }); //using EJS
   } catch (err) {
      return res.render("404", { title: "Page not found 404" });
   }
   if (!user) {
      return res.render("404", { title: "Page not found 404" });
   }
});

app.get("/profile/:id", async (req, res) => {
   try {
      const user = await User.findById(req.params.id,)
      res.render("profile", { user, title: `${user.name} | Profile` }); //using EJS
      if (!user) {
         return res.render("404", { title: "Page not found 404" });
      }
   } catch (err) {
      return res.render("404", { title: "Page not found 404" });
   }

});

app.put("/profile/:id", async (req, res) => {
   const { id } = req.params
   const user = await User.findByIdAndUpdate(id, { ...req.body.user })
   res.redirect(`profile/${user._id}`)
});


app.get("/*", (req, res) => {
   res.render("404", { title: "Page not found 404" }); //using EJS
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}`));
