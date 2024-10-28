import { Comment } from "../models/comment.model.js"

const addComment = async (req, res) => {
  try {
    const { comment, postId, commentorName, commentorProfileImage } = req.body
    if (!comment || !postId || !commentorName || !commentorProfileImage) {
      return res.send({ success: false, message: "Input value is missing" })
    }
    const newComment = new Comment({
      comment,
      postId,
      commentorName,
      commentorProfileImage,
    })

    newComment.save()

    return res.send({ success: true, message: "Comment Added" })
  } catch (error) {
    console.log(error)
  }
}

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
    res.send({ success: true, message: "All comments sent!!" })
  } catch (error) {
    if (error) console.log(error)
  }
}

const getCommentsForPostDetailsPage = async (req, res) => {
  try {
    const postId = req.query?.id
    if (!postId) {
      return res.send({ success: false, message: "post id not found" })
    }
    const commentsForPost = await Comment.find({ postId })
    if (!commentsForPost) {
      return res.send({ success: false, message: "comment not found" })
    }
    return res.send({
      success: true,
      message: `${commentsForPost.length} comments found`,
      comments: commentsForPost,
    })
  } catch (error) {
    console.log(error)
  }
}

const getAllCommentUserAdded = async (req, res) => {
  try {
    const email = req?.query
    if (!email) {
      return res.send({ success: false, message: "User email is missing" })
    }
    const comments = await Comment.find({ userEmail: email })
    res.send({
      success: true,
      message: "All comments you added!!",
      comments: comments,
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

export {
  addComment,
  getAllComments,
  getAllCommentUserAdded,
  getCommentsForPostDetailsPage,
}
