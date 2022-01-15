import User from "../models/user.js"

export const getFriends = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate('friends')
        if (!user) return res.json({ status: false, error: "User doesn't exist" })
        return res.json({ status: true, friends: user.friends })
    } catch (e) {
        // console.log(e.message)
        return res.json({ status: false, error: "Something Went wrong" })
    }
}

export const deleteFriend = async (req, res) => {
    try {
        const { id, fid } = req.params
        if (String(id) === String(fid)) return res.json({ status: false, error: "Illegal Operation" })
        const f1 = await User.findById(id);
        const f2 = await User.findById(fid);
        if (!f1 || !f2) return res.json({ status: false, error: "User not found" })
        f1.friends = f1.friends.filter((id1) => String(id1) !== String(fid));
        f2.friends = f2.friends.filter((id1) => String(id1) !== String(id));
        const res1 = await f1.save();
        const res2 = await f2.save();
        // console.log(res1, res2);
        res.json({ status: true });
    } catch (e) {
        // console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
}