const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/Task')
const Board = require("../models/Board")
const { actionCreator } = require('../utils/activityHelper')

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
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": details.status }, {
            $push: { "tasks.$.orderedList": task._id }
        })

        await actionCreator(req.user._id, boardId, `task named ${details.title} added in ${details.status}`, res)
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
            await Board.findOneAndUpdate({ _id: board, "tasks.status": toStatus }, {
                $push: { "tasks.$.orderedList": taskId }
            })
            await Board.findOneAndUpdate({ _id: board, "tasks.status": fromStatus }, {
                $pull: { "tasks.$.orderedList": taskId }
            })
        }

        if (toStatus && details.title && details.body) {
            description = `task named ${title} moved from ${fromStatus} to ${toStatus} with task name changed to ${details.title} and content added to the task`

        } else if (toStatus && details.title) {
            description = `task named ${title} moved from ${fromStatus} to ${toStatus} with task name changed to ${details.title}`

        } else if (toStatus && details.body) {
            description = `task named ${title} moved from ${fromStatus} to ${toStatus} and content added`

        } else if (details.title && details.body) {
            description = `task named ${title} changed to ${details.title} and content added`

        } else if (toStatus) {
            description = `task named ${title} moved from ${fromStatus} to ${toStatus}`

        } else if (details.title) {
            description = `task named ${title} changed to ${details.title}`

        } else {
            description = `content added to the task ${title}`
        }

        await actionCreator(req.user._id, board, description, res)
        res.json({ msg: "Task updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot update the tasks" })
    }
})

router.delete("/:boardId/:taskId/:status", auth, async (req, res) => {
    const { boardId, status, taskId } = req.params

    try {
        const { title } = await Task.findByIdAndRemove(taskId)
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $pull: { "tasks.$.orderedList": taskId }
        })

        await actionCreator(req.user._id, boardId, `task named ${title} deleted`, res)
        res.json({ msg: "Task deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

module.exports = router