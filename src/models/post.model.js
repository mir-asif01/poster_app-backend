import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true 
        },
        postImage : {
            type : String,
            required : true
        },
        summary : {
            type : String,
            required: true,
        },
        content : {
            type:String,
            required : true
        },
        likes : { 
            type : Number,
            default : 0
        }
    },
    {
        timestamps : true
    }
)

export const Post = mongoose.model("Post",postSchema)