import mongoose, { Schema } from "mongoose"
const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
)

export const Likes = mongoose.model("likes", likeSchema)
