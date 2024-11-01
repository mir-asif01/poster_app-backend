import mongoose from "mongoose"
import { Post } from "../models/post.model.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js"
import { Likes } from "../models/likes.model.js"
import { ObjectId } from "mongodb"
import { v2 as cloudinary } from "cloudinary"

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
      postImageCloudinaryPublicId: postImageHost?.public_id,
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
  if (!postId || !userId) {
    return res.send({ success: false, message: "PostId/UserId not found!" })
  }
  const postThatWasLiked = await Likes.find({
    likedPost: postId,
  })

  let postWasLiked = false

  postThatWasLiked.map((post) => {
    if (post.likedBy.equals(new ObjectId(userId))) {
      postWasLiked = true
    }
  })

  if (postWasLiked) {
    return res.send({ success: false, message: "You already liked the post" })
    // console.log("already liked")
  }
  await Likes.create({
    likedBy: userId,
    likedPost: postId,
  })
  return res.send({ success: true, message: "like added" })

  // console.log("post liked")
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          likes: 0,
          comments: 0,
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
    const id = req.query?.id
    if (!id) {
      return res.send({ success: false, message: "Email not found" })
    }
    const posts = await Post.aggregate([
      {
        $match: {
          creatorId: new mongoose.Types.ObjectId(id),
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          likes: 0,
          comments: 0,
        },
      },
    ])
    if (!posts) {
      return res.send({
        success: false,
        message: "You have not posted anything",
      })
    }
    return res.send({
      success: true,
      message: `Found ${posts.length ? posts?.length : 0} posts`,
      posts,
      postsCount: posts.length,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const deletePost = async (req, res) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.send({ success: false, message: "Post id not found" })
    }
    const post = await Post.findById(id)
    await cloudinary.uploader.destroy(post?.postImageCloudinaryPublicId)
    const deletePost = await Post.findByIdAndDelete(id)
    return res.send({
      success: true,
      message: "Post deleted successfully",
      deletePost,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const editPost = async (req, res) => {
  try {
    const { postId, newSummary, newContent } = req.body
    if (!(newSummary || newContent)) {
      return res.send({ success: false, message: "new values not found" })
    }
    const post = await Post.findById(postId)
    if (!post) {
      return res.send({ success: false, message: "post not found" })
    }
    post.summary = newSummary
    post.content = newContent
    post.save({ validateBeforeSave: false })

    return res.send({ success: true, message: "post updated" })
  } catch (error) {
    console.log(error)
  }
}

const searchPost = async (req, res) => {
  try {
    const keyword = req.query.search_keyword
    if (!keyword) {
      console.log("Query keyword not found")
    }
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
    const result = []
    posts.map((post) => {
      if (post.tags[0].includes(keyword)) {
        result.push(post)
      }
    })
    if (!result) {
      return res.send({ success: false, message: "no search result found!" })
    }

    return res.send({
      success: true,
      message: `${result.length} number of search result found`,
      posts: result,
    })
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
  editPost,
  searchPost,
}
