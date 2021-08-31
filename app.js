const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function (req, res) {
   res.render("index.html");
});

app.get("/register", function (req, res) {
   res.render("register.html");
});

app.get("/chat", function (req, res) {
   res.render("chat.html");
});

// app.get("/register", function (req, res) {
//    res.render("register.html");
// });

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`serving on port: ${PORT}`));
