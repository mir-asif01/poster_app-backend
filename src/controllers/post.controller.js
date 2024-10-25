import mongoose from "mongoose"
import { Post } from "../models/post.model.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js"
import { Likes } from "../models/likes.model.js"

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
    const pipelineResult = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "likedPost",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ])
    const post = pipelineResult[0]
    res.send({ success: true, message: "post found", post: post })
  } catch (error) {
    if (error) {
      console.log(error)
    }
  }
}

const addOneLike = async (req, res) => {
  const { postId, userId } = req.body
  console.log(postId, userId)
  if (!postId || !userId) {
    return res.send({ success: false, message: "PostId/UserId not found!" })
  }
  const isLiked = await Likes.findOne({
    likedBy: userId,
    likedPost: postId,
  })
  if (isLiked) {
    return res.send({ success: false, message: "You already liked the post" })
  }
  await Likes.create({
    likedBy: userId,
    likedPost: postId,
  })
  return res.send({ success: true, message: "like added" })
}

const getPostsForPostsPage = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "likedPost",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          likes: 0,
        },
      },
    ])
    if (!posts) {
      return res.send({ success: false, message: "no posts found" })
    }
    return res.send({
      success: true,
      message: `${posts.length} number of posts found`,
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
    const keyword = req.query.search_keyword
    if (!keyword) {
      console.log("Query keyword not found")
    }
    const posts = await Post.find()
    const result = []
    posts.map((post) => {
      if (post.tags[0].includes(keyword)) {
        result.push(post)
      }
    })
    res.send({ posts: result })
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
