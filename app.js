// require express
const express = require("express");
const app = express();

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

// app.set("views", __dirname + "/views"); //for using EJS
// app.engine("html", require("ejs").renderFile); //for using EJS
// app.set("view engine", "ejs"); //for using EJS
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "seeds")));

app.get("/", (req, res) => {
   // res.render("index.html");  //using EJS
   res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/register", async (req, res) => {
   // res.render("register.html"); //using EJS
   res.sendFile(path.join(__dirname, "./views/register.html"));
   // const user = new User({ name: "NiiDark" });
   // await user.save();
   // res.send(user);
});

app.get("/:id/chat", (req, res) => {
   // res.render("chat.html"); //using EJS
   res.sendFile(path.join(__dirname, "./views/chat.html"));
});

app.get("/:id/profile", (req, res) => {
   // res.render("chat.html"); //using EJS
   res.sendFile(path.join(__dirname, "./views/profile.html"));
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`serving on port: ${PORT}`));
