import { FriendRequest } from "../models/friend-request.model.js"
import { User } from "../models/user.model.js"


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

const acceptRequest = async (req, res) => {
    try {
        const { id, senderId, recieverId } = req.body
        if (!(id || senderId || recieverId)) {
            return res.send({ success: false, message: "Credentials missing" })
        }
        const request = await FriendRequest.findById(id)
        if (request) {
            request.status = "accepted"
            request.save({ validateBeforeSave: false })
        }
        const requestReciever = await User.findById(recieverId)
        if (requestReciever) {
            requestReciever.friends.push(senderId)
            requestReciever.save({ validateBeforeSave: false })
            res.send({ success: true, message: "Added to friend list" })
        }

    } catch (error) {
        if (error) console.log(error)
    }
}

const cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.body
        if (!requestId) {
            return res.send({ success: false, message: "requestId is missing!!" })
        }
        else {
            const request = await FriendRequest.findById(requestId)
            request.status = "rejected"
            request.save({ validateBeforeSave: false })
            res.send({ success: true, message: "Request delted!" })
        }
    } catch (error) {
        if (error) console.log(error);
    }
}

const getAllRequestsList = async (req, res) => {
    try {
        if (!userId) {
            return res.send({ success: false, message: "User id is missing!!" })
        }
        else {
            const allRequest = await FriendRequest.find({ recieverId: userId })
            res.send({ success: true, message: "All request list sent", allRequest: allRequest })
        }
    } catch (error) {
        if (error) console.log(error)
    }
    const { userId } = req.body
}

export { sendFriendRequest, acceptRequest, cancelRequest, getAllRequestsList }