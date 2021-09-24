const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ConversationSchema = new Schema({
    participants: [
        {
            type: String,
        }
    ],
    messages: [
        {
            author: {
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