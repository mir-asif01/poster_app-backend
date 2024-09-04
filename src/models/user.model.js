import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    profileImage: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: String,
      required: true,
    },
    currentPostion: {
      type: String,
    },
    facebookProfileLink: {
      type: String,
    },
    linkedInProfileLink: {
      type: String,
    },
    githubProfileLink: {
      type: String,
    },
    friends: [
      {
        friendId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 9)
})

export const User = mongoose.model("User", userSchema)

/* 
technicalSkills: {
            type: [skillSchema],
        },
        educationalInformations: {
            type: [educationSchema],
        },

*/
