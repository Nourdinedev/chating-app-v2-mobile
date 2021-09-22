const { array } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//require passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose")


const UserSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   photo: {
      type: String,
   },
   contacts: [
      {
         _id: {
            type: Schema.Types.ObjectId,
            ref: "User",
         },
         name: {
            type: String
         },
         email: {
            type: String
         }
      }
   ]
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' }); // use email as username
module.exports = mongoose.model("User", UserSchema);


// id: {
//    type: Schema.Types.ObjectId,
//    ref: "User"
// },