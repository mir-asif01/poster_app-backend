import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

const app = express()
const port = 3000

dotenv.config()
app.use(cors())
app.use(express.json())

//controllers import 
import { registerUser, loginUser, getAllUsers, logoutUser } from "./controllers/user.controller.js"
import { upload } from "./utils/multer.util.js"
import verifyJWT from "./middlewares/jwt.middleware.js"
import { acceptRequest, cancelRequest, getAllRequestsList, sendFriendRequest } from "./controllers/friend-request.controller.js"
import { addOneLike, createPost } from "./controllers/post.controller.js"

app.get("/", (req, res) => {
    res.send("backend server running!!")
})

// const dummyUser = {
//     userName: "asif17",
//     email: "asif@gmai.com",
//     password: "##########",
//     fullName: "Mir Kamrul Ahsan Asif",
//     profileImage: "",
//     coverImage: "",
//     about: "i am a developer from bangladesh. currently looking for a intern or full time oppurtunity! thank you",
//     currentPosition: "N/A",
//     educationalInformations: [
//         {
//             degreeName: "Diploma in Computer",
//             passingYear: "2024"
//         },
//         {
//             degreeName: "SSC",
//             passingYear: "2020"
//         }
//     ],
//     technicalSkills: [
//         {
//             skill: "C",
//             experience: "3",
//         },
//         {
//             skill: "JavaScript",
//             experience: "3",
//         },
//         {
//             skill: "ReactJS",
//             experience: "2.5",
//         },
//     ],
//     facebookProfileLink: "",
//     githubProfileLink: "",
//     linkedInProfileLink: "",
// }

async function main() {
    const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtnbd39.mongodb.net/poster_app?retryWrites=true&w=majority&appName=Cluster0`
    try {
        await mongoose.connect(URI)
            .then(res => console.log("db connected"))
            .catch(err => console.log("ERROR : ", err))


        // user authentication and authorizaton related api endpoints here
        app.post("/register", upload.fields([
            {
                name: "profileImage",
                maxCount: 1
            },
            {
                name: "coverImage",
                maxCount: 1
            }
        ]), registerUser)
        app.post("/login", loginUser)
        app.post("/logout", verifyJWT, logoutUser)
        app.get("/users", getAllUsers)

        // friend request add/cancel api endpoints
        app.post("/add-friend", sendFriendRequest)
        app.post("/accept-request", acceptRequest)
        app.post("/cancel-request", cancelRequest)

        // fetch all requests for friend request page
        app.get("/all-request/:id", getAllRequestsList)
        
        // post related routes
        app.post("/create-post", upload.single("postImage"),createPost)
        app.post("/add-one-like",addOneLike)



    } catch (error) {
        if (error) console.log(error)
    }
}
main().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`App is running on http://localhost:3000`);
})
