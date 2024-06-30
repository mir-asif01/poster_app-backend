import { Post } from "../models/post.model.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js";

const createPost = async (req,res)=>{
    try {
        const {title,summary,content} = req.body
        if(!(title || summary || content)){
            return res.send({success:true,message:"Fields can not be empty!!"});
        }

        const postImageFile = req.file.path
        if(!postImageFile){
            return res.send({success:false, message:"Image file not found"})
        }

        const postImageHost = await uploadImageOnCloudinary(postImageFile);
        console.log({title, image : postImageHost?.url, summary,content});

        const post = await Post.create({
            title,
            postImage : postImageHost?.url,
            summary,
            content
        })
        
        res.send({success:true, message:"Post created successfully!!"})
    
    } catch (error) {
        if(error) console.log(error)
    }
}

const addOneLike = async (req,res)=>{
    const {postId} = req.body
    if(!postId){
        return res.send({success : false, message:"Post ID not found!"})
    }
    const post = await Post.findById(postId)
    post.likes += 1
    post.save({ validateBeforeSave : false}) 
    res.send({success:true, message:"Like added!!"})
}

const getPostsForPostsPage = async (req,res) =>{
    try {
        
    } catch (error) {
        if(error) console.log(error);
    }
}

const getPostsAddedByUser = async(req,res)=>{
    try {
        const email = req.query?.params
        console.log(email);
    } catch (error) {
        if(error) console.log(error);
    }
}

const deletePost = async(req,res) =>{
    try {
        
    } catch (error) {
        if(error) console.log(error);
    }
}

export {createPost,addOneLike,deletePost,getPostsForPostsPage,getPostsAddedByUser}