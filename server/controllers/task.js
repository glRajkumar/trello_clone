const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/Task')
const Board = require("../models/Board")

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
        res.json({ id: task._id, msg: "Task saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Task creation failed" })
    }
})

router.put("/", auth, async (req, res) => {
    const { taskId, fromStatus, toStatus, ...details } = req.body

    try {
        let { board } = await Task.findByIdAndUpdate(taskId, { ...details })
        if (fromStatus && toStatus) {
            await Board.findOneAndUpdate({ _id: board, "tasks.status": toStatus }, {
                $push: { "tasks.$.orderedList": taskId }
            })
            await Board.findOneAndUpdate({ _id: board, "tasks.status": fromStatus }, {
                $pull: { "tasks.$.orderedList": taskId }
            })
        }

        res.json({ msg: "Task updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot update the tasks" })
    }
})

router.delete("/:boardId/:taskId/:status", auth, async (req, res) => {
    const { boardId, status, taskId } = req.params

    try {
        await Task.findByIdAndRemove(taskId)
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $pull: { "tasks.$.orderedList": taskId }
        })
        res.json({ msg: "Task deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

module.exports = router