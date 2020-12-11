const Activity = require('../models/Activity')
const Task = require('../models/Task')

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

async function taskTitle(taskId, res) {
    try {
        const { title } = await Task.findById(taskId).select("title").lean()
        return title

    } catch (error) {
        return res.status(400).json({ error, msg: "cannot get title for the task" })
    }
}

module.exports = {
    activityCreator,
    taskTitle
}