import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true
        },
        recieverId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["rejected", "accepted", "pending"],
            default: "pending"
        }
    },
    { timestamps: true }
)
export const FriendRequest = mongoose.model("FriendRequest", requestSchema)