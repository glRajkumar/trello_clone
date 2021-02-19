const Task = require('../models/Task')

async function taskTitleFinder(taskId, res) {
    try {
        const { title } = await Task.findById(taskId).select("title").lean()
        return title

    } catch (error) {
        return res.status(400).json({ error, msg: "cannot get title for the task" })
    }
}

module.exports = {
    taskTitleFinder
}