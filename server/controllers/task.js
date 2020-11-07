const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/Task')

const router = express.Router()

router.get("/", auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const userId = req.user._id

    try {
        const tasks = await Task.find({ postedBy: userId })
            .select("-postedBy -createdAt -__v")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        res.json({ tasks })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

router.post("/", auth, async (req, res) => {
    const { title, body, catagery } = req.body
    const userId = req.user._id

    try {
        const task = new Task({ title, body, catagery, postedBy: userId })
        await task.save()

        res.json({ msg: "Task saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

router.put("/", auth, async (req, res) => {
    const { id, title, body, catagery } = req.body

    try {
        await Task.findByIdAndUpdate(id, { title, body, catagery }, { new: true })
        res.json({ msg: "Task updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params

    try {
        await Task.findByIdAndRemove(id)
        res.json({ msg: "Task deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get tasks" })
    }
})

module.exports = router