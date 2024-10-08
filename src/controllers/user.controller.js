import { User } from "../models/user.model.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js"
import bcrypt from "bcrypt"
import genarateJwtToken from "../utils/genarateJWT.js"

const registerUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      fullName,
      about,
      currentPosition,
      technicalSkills,
      facebookProfileLink,
      linkedInProfileLink,
      githubProfileLink,
    } = req.body

    const profileImagePath = req.files?.profileImage[0].path
    const coverImagePath = req.files?.coverImage[0].path

    if (!profileImagePath) {
      return res.send({ message: "Profile Image is required" })
    }
    if (!coverImagePath) {
      return res.send({ message: "Cover Image is required" })
    }

    const profileImageHostResponse = await uploadImageOnCloudinary(
      profileImagePath
    )
    const coverImageHostResponse = await uploadImageOnCloudinary(coverImagePath)

    const user = await User.create({
      userName,
      email,
      password,
      profileImage: profileImageHostResponse.url,
      coverImage: coverImageHostResponse.url,
      fullName,
      about,
      currentPosition,
      technicalSkills,
      facebookProfileLink,
      linkedInProfileLink,
      githubProfileLink,
    })
    return res.send({ user: user, success: true, message: "user added" })
  } catch (error) {
    if (error) console.log(error)
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.send({ success: false, message: "Can not find your email..." })
    }

    const isPasswordMatch = await bcrypt.compare(password, user?.password)

    if (!isPasswordMatch) {
      return res.send({ success: false, message: "Incorrect Password..." })
    }

    res.send({
      success: true,
      user: user,
      message: "Login Successful...",
    })
  } catch (error) {
    if (error) console.log(error)
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find()
  res.send(users)
}

const updateUserInformation = async (req, res) => {
  try {
  } catch (error) {
    if (error) {
      console.log(error)
    }
  }
}

export { registerUser, loginUser, getAllUsers, updateUserInformation }
