import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId : {
            type : String,
            required : true
        },
        userEmail : {
            type : String,
            required : true
        },
        comment : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)

export const Comment = mongoose.model("Comment",commentSchema)