import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
} from "./src/controllers/user.controller.js"
import { upload } from "./src/utils/multer.util.js"
import verifyJWT from "./src/middlewares/jwt.middleware.js"
import {
  addOneLike,
  createPost,
  deletePost,
  editPost,
  getPostsAddedByUser,
  getPostsForPostsPage,
  getSinglePost,
  searchPost,
} from "./src/controllers/post.controller.js"
import {
  addComment,
  getAllCommentUserAdded,
  getAllComments,
  getCommentsForPostDetailsPage,
} from "./src/controllers/comment.controller.js"

const app = express()
const port = 3000

dotenv.config()
app.use(cors())
app.use(express.json())

//controllers import

app.get("/", (req, res) => {
  res.send("backend server running!!")
})

async function main() {
  const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtnbd39.mongodb.net/poster_app?retryWrites=true&w=majority&appName=Cluster0`
  try {
    await mongoose
      .connect(URI)
      .then((res) => console.log("db connected"))
      .catch((err) => console.log("ERROR : ", err))

    // user authentication and authorizaton related api endpoints here
    app.post(
      "/register",
      upload.fields([
        {
          name: "profileImage",
          maxCount: 1,
        },
        {
          name: "coverImage",
          maxCount: 1,
        },
      ]),
      registerUser
    )
    app.post("/login", loginUser)
    app.get("/users", getAllUsers)
    app.get("/users/:id", getSingleUser)

    // post related routes
    app.post("/create-post", upload.single("postImage"), createPost)
    app.get("/posts/:id", getSinglePost)
    app.post("/add-one-like", addOneLike)
    app.get("/posts-by-user", getPostsAddedByUser)
    app.get("/posts", getPostsForPostsPage)
    app.get("/search-post", searchPost) // search keyword will be passed via query params
    app.patch("/edit-post", editPost)
    app.delete("/post/:id", deletePost)

    // comment adding api
    app.post("/add-comment", addComment)
    app.get("/comments-for-post", getCommentsForPostDetailsPage)
    app.get("/all-comments", getAllComments)
    app.get("/all-user-comments", getAllCommentUserAdded)
  } catch (error) {
    if (error) console.log(error)
  }
}
main().catch((err) => console.log(err))

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
