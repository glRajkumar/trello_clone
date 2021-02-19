const Activity = require('../models/Activity')

//details -> postedBy, boardId, description
async function activityCreator(postedBy, boardId, description, res) {
    try {
        const activity = new Activity({ postedBy, boardId, description })
        await activity.save()
        return true

    } catch (error) {
        return res.status(400).json({ error, msg: "activity creation failed" })
    }
}

module.exports = {
    activityCreator
}