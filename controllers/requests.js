import User from "../models/user.js"
import PersonalChat from "../models/PersonalChat.js";
export const getRequests = async (req, res) => { // sends all the requests recieved
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('requests');
        if (!user) return res.json({ status: false, error: "User doesn't exist" })
        const requests = user.requests
        res.json({ status: true, requests })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }

}

export const requestResponseHandler = async (req, res) => { // logged in user(id) responding to a particular request(fid)
    try {
        const { id: recipientId, fId: requesterId } = req.params
        const { status } = req.body;
        if (String(recipientId) === String(requesterId)) return res.json({ status: false, error: "Illegal Operation" })
        const recipient = await User.findById(recipientId)
        const requester = await User.findById(requesterId)
        if (!recipient && !requester) return res.json({ status: false, error: "User not found" })
        if (status) {
            recipient.friends.push(requesterId);
            requester.friends.push(recipientId);
            const chat1 = await PersonalChat.find({ participants: { $all: [requesterId, recipientId] } })
            console.log("chat 1 ==>", chat1)
            if (chat1.length === 0) {
                const room = await PersonalChat.create({ participants: [requesterId, recipientId] });
                recipient.personalChats.push(room.id)
                requester.personalChats.push(room.id)
            }
        }
        recipient.requests = recipient.requests.filter(id => String(id) !== String(requesterId))
        requester.sentRequests = requester.sentRequests.filter(id => String(id) !== String(recipientId))
        const req1 = await requester.save()
        const rec = await recipient.save()
        // console.log(rec)
        // console.log(req1)
        return res.json({ status: true })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
}

export const sendRequest = async (req, res) => { // logged in user(id) sending request to a other user(fid)
    try {
        const { id: requesterId, fId: recipientId } = req.params // requester - sender && recipient - receiver
        if (String(requesterId) === String(recipientId)) return res.json({ status: false, error: "Illegal Operation" })
        const requester = await User.findById(requesterId);
        const recipient = await User.findById(recipientId);
        if (!recipient || !requester) return res.json({ status: false, error: "User doesn't exist" })
        recipient.requests.push(requester);
        requester.sentRequests.push(recipient)
        const n = await recipient.save()
        const t = await requester.save()
        console.log("requester => ", t.username)
        console.log("recipient => ", n.username)
        res.json({ status: true })
    } catch (e) {
        console.log(e.message, "\n", e.stack)
        res.json({ status: false, error: "Something Went wrong" })
    }
}

export const getSentRequests = async (req, res) => { // responds with all the requests made by user
    try {
        const { id } = req.params
        const user = await User.findById(id).populate("sentRequests");
        if (!user) return res.json({ status: false, error: "User doesn't exist" })
        console.log("sentRequests => " + user.sentRequests)
        res.json({ status: true, sentRequests: user.sentRequests })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
}

export const deleteARequest = async (req, res) => { // deletes a request sent by a user(fid)
    try {
        const { id, fid } = req.params;
        if (String(id) === String(fid)) return res.json({ status: false, error: "Illegal Operation" })
        const sender = await User.findById(id);
        const receiver = await User.findById(fid);
        if (!sender || !receiver) return res.json({ status: false, error: "User doesn't exist" })
        sender.sentRequests = sender.sentRequests.filter(id1 => String(id1) !== String(fid))
        receiver.requests = receiver.requests.filter(id1 => String(id1) !== String(id));
        const newReceiver = await receiver.save()
        const newSender = await sender.save();
        console.log(newReceiver, newSender)
        res.json({ status: true })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
}