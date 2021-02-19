const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/Task')
const { boardTaskAdd, boardTaskDel } = require('../utils/boardHelper')
const { activityCreator } = require('../utils/activityHelper')

const router = express.Router()

router.get("/", auth, async (req, res) => {
    const { taskId } = req.body

    try {
        const task = await Task.findById(taskId)
        res.json({ task, msg: "Task saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Task creation failed" })
    }
})

router.post("/", auth, async (req, res) => {
    const { boardId, ...details } = req.body

    try {
        const task = new Task({ board: boardId, ...details })
        await task.save()

        await boardTaskAdd(boardId, details.status, task._id, res)
        await activityCreator(req.user._id, boardId, `added new task named ${details.title} in ${details.status}`, res)
        res.json({ id: task._id, msg: "Task saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Task creation failed" })
    }
})

router.put("/", auth, async (req, res) => {
    const { taskId, fromStatus, toStatus, ...details } = req.body
    let description = null

    try {
        let { board, title } = await Task.findByIdAndUpdate(taskId, { ...details })

        if (toStatus) {
            await boardTaskAdd(board, toStatus, taskId, res)
            await boardTaskDel(board, fromStatus, taskId, res)
        }

        if (toStatus && details.title && details.body) {
            description = `moved task named ${title} from ${fromStatus} to ${toStatus} with new name ${details.title} and added content to the task`

        } else if (toStatus && details.title) {
            description = `moved task named ${title} from ${fromStatus} to ${toStatus} with new name ${details.title}`

        } else if (toStatus && details.body) {
            description = `moved task named ${title} from ${fromStatus} to ${toStatus} and added content to the task`

        } else if (details.title && details.body) {
            description = `changed task named ${title} to ${details.title} and added content to the task`

        } else if (toStatus) {
            description = `moved task named ${title} from ${fromStatus} to ${toStatus}`

        } else if (details.title) {
            description = `changed task named ${title} to ${details.title}`

        } else {
            description = `added content to the task ${title}`
        }

        await activityCreator(req.user._id, board, description, res)
        res.json({ msg: "Task updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot update the tasks" })
    }
})

router.delete("/:boardId/:taskId/:status", auth, async (req, res) => {
    const { boardId, status, taskId } = req.params

    try {
        const { title } = await Task.findByIdAndRemove(taskId)
        await boardTaskDel(boardId, status, taskId, res)
        await activityCreator(req.user._id, boardId, `deleted the task named ${title}`, res)
        res.json({ msg: "Task deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

module.exports = router