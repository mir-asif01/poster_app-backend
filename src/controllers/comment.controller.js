import { Comment } from "../models/comment.model.js"

const addComment = async(req,res) => {
 try {
    const {postId,userEmail,comment} = req.body
    if(!(postId || userEmail || comment)){
        return res.send({success:false, nessage:"Credentials misssing!!"})
    }
    const commentInsert = await Comment.create(
        {
            postId,
            userEmail,
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

const getAllCommentUserAdded = async (req,res) =>{
    try {
        const email = req?.query
        if(!email){
            return res.send({success:false,message:"User email is missing"})
        }
        const comments = await Comment.find({userEmail : email})
        res.send({success : true, message:"All comments you added!!",comments:comments})
    } catch (error) {
        if(error) console.log(error);
    }
}

export {addComment,getAllComments,getAllCommentUserAdded}