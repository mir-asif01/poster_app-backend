import mongoose, { Schema } from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    commentorName: {
      type: String,
      required: true,
    },
    commentorProfileImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Comment = mongoose.model("Comment", commentSchema)
