const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ConversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    messages: [
        {
            author: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            body: {
                type: String,
                required: true
            },
            timestamp: {
                type: Number,
            }
        }
    ]
});

module.exports = mongoose.model("Conversation", ConversationSchema);


// id: {
//    type: Schema.Types.ObjectId,
//    ref: "User"
// },