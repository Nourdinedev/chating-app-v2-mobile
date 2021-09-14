const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose")


const UserSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   photo: String,
   country: String,
   city: String,
   bio: String,
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); // use email as username
module.exports = mongoose.model("User", UserSchema);
