import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorProfileImage: {
      type: String,
      required: true,
    },
    creatorCurrentPosition: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Post = mongoose.model("Post", postSchema)
