import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        if (!token) {
            console.log("token not found");
        }
        console.log("token : ", token);
        const jwt_payload = await jwt.verify(token, process.env.JWT_SECRET)
        console.log("payload : ", jwt_payload);
        const user = await User.findById(jwt_payload._id).select("-password")
        console.log("user : ", user)
        // if (!user) {
        //     res.send({ message: "user not found" })
        // }

        // req.user = user
        next()

    } catch (error) {
        if (error) {
            console.log(error);
        }
    }
}

export default verifyJWT