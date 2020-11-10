const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/Task')
const Board = require("../models/Board")

const router = express.Router()

router.get("/:boardId", auth, async (req, res) => {
    const { boardId } = req.params

    try {
        const tasks = await Task.find({ board: boardId })
            .select("status title body")
            .sort('-createdAt')
            .lean()

        res.json({ tasks })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

router.get("/task/:taskId", auth, async (req, res) => {
    const { taskId } = req.params

    try {
        const tasks = await Task.findById(taskId)
            .select("-__v -createdAt")
            .lean()

        res.json({ tasks })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

router.post("/", auth, async (req, res) => {
    const { boardid, ...details } = req.body

    try {
        const task = new Task({ board: boardid, ...details })
        await task.save()
        await Board.findByIdAndUpdate(boardid, { $push: { tasks: task._id } })
        res.json({ id: task._id, msg: "Task saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Task creation failed" })
    }
})

router.put("/", auth, async (req, res) => {
    const { taskId, ...details } = req.body

    try {
        await Task.findByIdAndUpdate(taskId, { ...details })
        res.json({ msg: "Task updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot update the tasks" })
    }
})

router.delete("/:boardId/:taskId", auth, async (req, res) => {
    const { boardId, taskId } = req.params

    try {
        await Task.findByIdAndRemove(taskId)
        await Board.findByIdAndUpdate(boardId, { $pull: { tasks: taskId } })
        res.json({ msg: "Task deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

module.exports = router