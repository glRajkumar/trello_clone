const express = require('express')
const auth = require('../middlewares/auth')
const Board = require('../models/Board')

const router = express.Router()

router.get("/boards", auth, async (req, res) => {
    const userId = req.user._id

    try {
        const boards = await Board.find({ postedBy: userId })
            .select('boardName catagery bg isPublic')
            .sort('-createdAt')
            .lean()

        res.json({ boards })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get boards" })
    }
})

router.get("/:boardId", auth, async (req, res) => {
    const { boardId } = req.params

    try {
        let board = await Board.find({ _id: boardId })
            .select("postedBy tasks")
            .populate("tasks.orderedList", "title body")
            .sort('-createdAt')
            .lean()

        board = board[0]
        board.tasks = board.tasks.map(task => {
            return {
                status: task.status,
                tasks: task.orderedList
            }
        })
        res.json({ board })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get board" })
    }
})

router.get("/members/:boardId", auth, async (req, res) => {
    const { boardId } = req.params

    try {
        const members = await Board.find({ _id: boardId })
            .select("members -_id")
            .populate("members.user", "userName")
            .lean()

        res.json({ members })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get members" })
    }
})

router.post("/", auth, async (req, res) => {
    const { ...payload } = req.body
    const userId = req.user._id

    try {
        const existBoard = await Board.findOne({ boardName: payload.boardName, catagery: payload.catagery, postedBy: userId })
        if (existBoard) return res.status(400).json({ msg: "Board already existed with same catagery" })

        const board = new Board({ ...payload, postedBy: userId })
        await board.save()

        res.json({ id: board._id, msg: "Board saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Board creation failed" })
    }
})

router.put("/public", auth, async (req, res) => {
    const { boardId, isPublic } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, { isPublic })
        res.json({ msg: "Board public status updated successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/add-status", auth, async (req, res) => {
    const { boardId, status } = req.body
    const tasks = {
        status,
        orderedList: []
    }

    try {
        await Board.findByIdAndUpdate(boardId, {
            $push: { tasks, taskStatus: status }
        })
        res.json({ msg: "new status added successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot add new status" })
    }
})

router.put("/del-status", auth, async (req, res) => {
    const { boardId, status } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, {
            $pull: { taskStatus: status, tasks: { status } }
        })
        res.json({ msg: "status deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot delete the status" })
    }
})

router.put("/reorder-task", auth, async (req, res) => {
    const { boardId, status, taskid, to } = req.body

    try {
        //deleting the item
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $pull: { "tasks.$.orderedList": taskid }
        })

        // inserting the item in the position 
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $push: { "tasks.$.orderedList": { $each: [taskid], $position: to } }
        })

        res.json({ msg: "tasks reodered successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "tasks reoder operation failed" })
    }
})

router.put("/restatus-task", auth, async (req, res) => {
    const { boardId, fromStatus, toStatus, taskid, to } = req.body

    try {
        //deleting the item
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": fromStatus }, {
            $pull: { "tasks.$.orderedList": taskid }
        })

        // inserting the item in the position 
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": toStatus }, {
            $push: { "tasks.$.orderedList": { $each: [taskid], $position: to } }
        })

        res.json({ msg: "tasks restatused successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "tasks restatus operation failed" })
    }
})

router.put("/reorder-status", auth, async (req, res) => {
    const { boardId, from, to } = req.body

    try {
        let board = await Board.findById(boardId).select("taskStatus tasks")
        let { taskStatus, tasks } = board
        let remaingTaskStatus = taskStatus.filter((status, i) => i !== from)
        let remaingTasks = tasks.filter((task, i) => i !== from)

        let newTaskStatus = [
            ...remaingTaskStatus.slice(0, to),
            taskStatus[from],
            ...remaingTaskStatus.slice(to)
        ]

        let newTasks = [
            ...remaingTasks.slice(0, to),
            tasks[from],
            ...remaingTasks.slice(to)
        ]

        board.taskStatus = newTaskStatus
        board.tasks = newTasks
        await board.save()

        res.json({ msg: "stauts reordered successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "stauts reorder updation failed" })
    }
})

router.put("/addmember", auth, async (req, res) => {
    const { boardId, memId, permision } = req.body
    const payload = {
        user: memId
    }

    if (permision) payload.permision = permision

    try {
        await Board.findByIdAndUpdate(boardId, {
            $push: { members: { ...payload } }
        })
        res.json({ msg: "Added member to the board successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot add a member to the board" })
    }
})

router.put("/removememb", auth, async (req, res) => {
    const { boardId, _id } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, {
            $pull: { members: { _id } }
        })
        res.json({ msg: "Removed member from the board successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot remove the member from the board" })
    }
})

router.delete("/:boardId", auth, async (req, res) => {
    const { boardId } = req.params

    try {
        await Board.findByIdAndRemove(boardId)
        res.json({ msg: "Board deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot delete the board" })
    }
})

module.exports = router