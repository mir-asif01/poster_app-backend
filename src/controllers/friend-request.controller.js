import { FriendRequest } from "../models/friend-request.model"

const sendFriendRequest = async (req, res) => {
    // const requsetModel = {
    //     senderId,
    //     recieverId,
    //     status
    // }

    const { senderId, recieverId } = req.body
    const friendRequest = {
        senderId,
        recieverId
    }
    if (!senderId) {
        res.send({ success: false, message: "sender Id is missing" })
    }
    if (!recieverId) {
        res.send({ success: false, message: "reciever Id is missing" })
    }
    const result = await FriendRequest.create(friendRequest)
    res.send({ success: true, message: "Request sent!" }, result)
}


export { sendFriendRequest }