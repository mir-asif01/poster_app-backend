import mongoose, { Schema } from "mongoose"

const importantSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
)

export const Importants = mongoose.Model("Importants", importantSchema)
