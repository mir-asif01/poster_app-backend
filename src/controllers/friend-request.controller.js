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
        const isRequestExist = await FriendRequest.findOne({ senderId: senderId, recieverId: recieverId })
        if (isRequestExist) {
            return res.send({ success: false, message: "Already sent request!" })

        }
        if (!senderId) {
            return res.send({ success: false, message: "sender Id is missing" })

        }
        if (!recieverId) {
            return res.send({ success: false, message: "reciever Id is missing" })

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