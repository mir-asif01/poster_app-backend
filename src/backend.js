import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 3000;

dotenv.config();
app.use(cors());
app.use(express.json());

//controllers import
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "./controllers/user.controller.js";
import { upload } from "./utils/multer.util.js";
import verifyJWT from "./middlewares/jwt.middleware.js";
import {
  acceptRequest,
  cancelRequest,
  getAllRequestsList,
  sendFriendRequest,
} from "./controllers/friend-request.controller.js";
import {
  addOneLike,
  createPost,
  getPostsAddedByUser,
  getPostsForPostsPage,
  getSinglePost,
} from "./controllers/post.controller.js";
import {
  addComment,
  getAllCommentUserAdded,
  getAllComments,
} from "./controllers/comment.controller.js";

app.get("/", (req, res) => {
  res.send("backend server running!!");
});

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
  const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtnbd39.mongodb.net/poster_app?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose
      .connect(URI)
      .then((res) => console.log("db connected"))
      .catch((err) => console.log("ERROR : ", err));

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
    );
    app.post("/login", loginUser);
    app.get("/users", verifyJWT, getAllUsers);

    // friend request add/cancel api endpoints
    app.post("/add-friend", verifyJWT, sendFriendRequest);
    app.post("/accept-request", verifyJWT, acceptRequest);
    app.post("/cancel-request", verifyJWT, cancelRequest);

    // fetch all requests for friend request page
    app.get("/all-request/:id", verifyJWT, getAllRequestsList);

    // post related routes
    app.post("/create-post", verifyJWT, upload.single("postImage"), createPost);
    app.get("/posts/:id", verifyJWT, getSinglePost);
    app.post("/add-one-like", verifyJWT, addOneLike);
    app.get("/posts-by-user", verifyJWT, getPostsAddedByUser);
    app.get("/posts", verifyJWT, getPostsForPostsPage);

    // comment adding api
    app.post("/add-comment", verifyJWT, addComment);
    app.get("/all-comments", verifyJWT, getAllComments);
    app.get("/all-user-comments", verifyJWT, getAllCommentUserAdded);
  } catch (error) {
    if (error) console.log(error);
  }
}
main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`App is running on http://localhost:3000`);
});
