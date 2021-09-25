
// require mongoose
const mongoose = require("mongoose");
const User = require("../models/user");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/chating";

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

// const seedDB = async () => {
//    await User.deleteMany({});
//    for (let i = 0; i < 25; i++) {
//       var name =
//          random_names[Math.floor(Math.random() * random_names.length)] +
//          " " +
//          random_names[Math.floor(Math.random() * random_names.length)];

//       var string = "";
//       for (let i = 0; i < 15; i++) {
//          const random = Math.floor(Math.random() * random_email.chars.length);
//          string += random_email.chars[random];
//          const extantion = random_email.extantion[random];
//          var email = string + extantion;
//       }
//       var string2 = "";
//       for (let i = 0; i < 15; i++) {
//          const random = Math.floor(Math.random() * random_email.chars.length);
//          string2 += random_password[random];
//          var password = string2;
//       }

//       const user = new User({ name, email, password });
//       await user.save();
//    }
// };

const seedDB = async () => {
   await User.deleteMany({});
};

seedDB();

seedDB().then(() => {
   mongoose.connection.close();
});


