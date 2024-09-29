import mongoose from "mongoose"
import { Post } from "../models/post.model.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js"

const createPost = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      tags,
      creatorId,
      creatorName,
      creatorProfileImage,
      creatorCurrentPosition,
    } = req.body
    if (
      !(
        title ||
        summary ||
        content ||
        tags ||
        creatorName ||
        creatorCurrentPosition ||
        creatorProfileImage
      )
    ) {
      return res.send({ success: true, message: "Fields can not be empty!!" })
    }

    const postImageFile = req.file.path
    if (!postImageFile) {
      return res.send({ success: false, message: "Image file not found" })
    }

    const postImageHost = await uploadImageOnCloudinary(postImageFile)

    const post = await Post.create({
      title,
      postImage: postImageHost?.url,
      summary,
      content,
      tags,
      creatorId,
      creatorName,
      creatorProfileImage,
      creatorCurrentPosition,
    })

    res.send({
      success: true,
      message: "Post created successfully!!",
      post: post,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params
    if (!postId) {
      return res.send({ success: false, message: "post id not found" })
    }
    const post = await Post.findById(new mongoose.Types.ObjectId(postId))
    res.send({ success: true, message: "post found", post: post })
  } catch (error) {
    if (error) {
      console.log(error)
    }
  }
}

const addOneLike = async (req, res) => {
  const { postId } = req.body
  if (!postId) {
    return res.send({ success: false, message: "Post ID not found!" })
  }
  const post = await Post.findById(postId)
  post.likes += 1
  post.save({ validateBeforeSave: false })
  res.send({ success: true, message: "Like added!!" })
}

const getPostsForPostsPage = async (req, res) => {
  try {
    const posts = await Post.find()
    res.send({
      success: true,
      message: `Found ${posts.length ? posts?.length : 0} posts in database`,
      posts,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const getPostsAddedByUser = async (req, res) => {
  try {
    const email = req.query?.email
    if (!email) {
      return res.send({ success: false, message: "Email not found" })
    }
    const posts = await Post.find({ email: email })
    res.send({
      success: true,
      message: `Found ${posts.length ? posts?.length : 0} posts`,
      posts,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const deletePost = async (req, res) => {
  try {
    const postId = req.params
    if (!postId) {
      return res.send({ success: false, message: "Post id not found" })
    }
    const deletePost = await Post.findByIdAndDelete(postId)
    res.send({
      success: true,
      message: "Post deleted successfully",
      deletePost,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const searchPost = async (req, res) => {
  try {
    // search keyword will be passed via query params
    // query params structure ---> ?search_keyword=javascript,golang
  } catch (error) {
    console.log(error)
  }
}

export {
  createPost,
  getSinglePost,
  addOneLike,
  deletePost,
  getPostsForPostsPage,
  getPostsAddedByUser,
  searchPost,
}

/*

{
  "_id" : 1,
  "title" : "title",
  "tags" : ["tag1","tag2"] 
}

->
  db.collection.find({
    tags: { $in: ["tag1", "tag2"] }
  })

*/
