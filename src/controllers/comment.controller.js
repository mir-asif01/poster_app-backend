import { Comment } from "../models/comment.model.js"

const addComment = async(req,res) => {
 try {
    const {postId,comment} = req.body
    if(!(postId || comment)){
        return res.send({success:false, nessage:"Credentials misssing!!"})
    }
    const commentInsert = await Comment.create(
        {
            postId,
            comment
        }
    )
    res.send({success:false, message:"Comment added"});
 } catch (error) {
    if(error){
        comsole.log(error)
    }
 }
}

const getAllComments = async (req,res) => {
    try {
        const comments = await Comment.find()
        res.send({success:true,message: "All comments sent!!" })
    } catch (error) {
        if(error) console.log(error);
    }
}

export {addComment,getAllComments}