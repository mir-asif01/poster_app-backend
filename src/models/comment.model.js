import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId : {
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

const getAllComments = async (req,res) => {
    try {
        const comments = await Comment.find()
        res.send({success:true,message: "All comments sent!!" })
    } catch (error) {
        if(error) console.log(error);
    }
}

export const Comment = mongoose.model("Comment",commentSchema)