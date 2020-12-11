const { Activity, Action } = require('../models/Activity')
const Task = require('../models/Task')

async function activityCreator(boardId, res) {
    try {
        const activity = new Activity({ boardId })
        await activity.save()
        return activity._id

    } catch (error) {
        return res.status(400).json({ msg: "activity creating action failed" })
    }
}

async function actionCreator(postedBy, boardId, description, res) {
    try {
        const action = new Action({ postedBy, description })
        await action.save()

        await Activity.findOneAndUpdate({ boardId }, {
            $push: { actions: action._id }
        })

        return true

    } catch (error) {
        return res.status(400).json({ msg: "activity creating action failed" })
    }
}

async function taskTitle(taskId, res) {
    try {
        const { title } = await Task.findById(taskId).select("title").lean()
        return title

    } catch (error) {
        return res.status(400).json({ msg: "cannot get title fot the task" })
    }
}

module.exports = {
    activityCreator,
    actionCreator,
    taskTitle
}