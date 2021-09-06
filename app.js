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

//Join paths
app.use(express.static(path.join(__dirname, "dist")));

//routes
app.get("/", (req, res) => {
   res.render("home");  //using EJS

});

app.get("/sign", async (req, res) => {
   res.render("sign"); //using EJS
});

app.post("/sign", async (req, res) => {
   const user = new User(req.body.user)
   await user.save();
   res.redirect(`sign/${user._id}`)
});

app.get("/sign/:id", async (req, res) => {
   const user = await User.findById(req.params.id)
   res.render("chat", { user }); //using EJS
});

app.get("/profile/:id", async (req, res) => {
   const user = await User.findById(req.params.id)
   res.render("profile", { user }); //using EJS
});


app.get("/*", (req, res) => {
   res.render("404"); //using EJS
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`serving on port: ${PORT}`));
