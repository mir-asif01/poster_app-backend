import { FriendRequest } from "../models/friend-request.model.js"

// const requsetModel = {
//     senderId,
//     recieverId,
//     status
// }
const sendFriendRequest = async (req, res) => {

    try {
        const { senderId, recieverId } = req.body
        const friendRequest = {
            senderId,
            recieverId
        }
        console.log(friendRequest);
        if (!senderId) {
            res.send({ success: false, message: "sender Id is missing" })
        }
        if (!recieverId) {
            res.send({ success: false, message: "reciever Id is missing" })
        }
        else {
            const result = await FriendRequest.create(friendRequest)
            res.send({ success: true, message: "Request sent!" })
        }
    } catch (error) {
        if (error) console.log(error)
    }
}


export { sendFriendRequest }