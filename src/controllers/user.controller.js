import { User } from "../models/user.model.js"
import { uploadImageOnCloudinary } from "../utils/cloudinary.util.js"
import bcrypt from "bcrypt"
import genarateJwtToken from "../utils/genarateJWT.js"


const registerUser = async (req, res) => {
    try {
        const { userName, email, password, fullName, about, currentPostion, technicalSkills, educationalInformations, facebookProfileLink, linkedInProfileLink, githubProfileLink } = req.body

        const profileImagePath = req.files?.profileImage[0].path
        const coverImagePath = req.files?.coverImage[0].path

        if (!profileImagePath) res.send({ message: "Profile Image is required" })
        if (!coverImagePath) res.send({ message: "Cover Image is required" })

        const profileImageHostResponse = await uploadImageOnCloudinary(profileImagePath)
        const coverImageHostResponse = await uploadImageOnCloudinary(coverImagePath)

        const user = await User.create({
            userName,
            email,
            password,
            profileImage: profileImageHostResponse.url,
            coverImage: coverImageHostResponse.url,
            fullName,
            about,
            currentPostion,
            technicalSkills,
            facebookProfileLink,
            linkedInProfileLink,
            githubProfileLink,
        })
        res.send({ success: true, message: "user added" })


    } catch (error) {
        if (error) console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }).select("-password")

        if (!user) {
            res.send({ success: false, message: "Can not find your email..." })
            return
        }
        const hashedPassword = user?.password
        const isPasswordMatch = bcrypt.compare(password, hashedPassword)
        if (!isPasswordMatch) {
            res.send({ success: false, message: "Incorrect Password..." })
            return
        }

        const token = genarateJwtToken(user?._id, user?.email)

        console.log(token);
        res.send({ success: true, message: "Login Successful...", token: token ,user: user})

    } catch (error) {
        if (error) console.log(error);
    }
}

const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.send(users)
}


export { registerUser, loginUser, getAllUsers}