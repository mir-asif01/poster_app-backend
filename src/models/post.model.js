import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true 
        },
        image : {
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
            type : Number
        }
    },
    {
        timestamps : true
    }
)

export const Post = mongoose.Model("Post",postSchema)