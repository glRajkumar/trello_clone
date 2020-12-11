const express = require('express')
const auth = require('../middlewares/auth')
const Board = require('../models/Board')
const { activityCreator, actionCreator, taskTitle } = require("../utils/activityHelper")

const router = express.Router()

router.get("/boards", auth, async (req, res) => {
    const userId = req.user._id

    try {
        const boards = await Board.find({ postedBy: userId })
            .select('boardName catagery bg')
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
        let board = await Board.findOne({ _id: boardId })
            .select("postedBy tasks members isPublic activityId")
            .populate("tasks.orderedList", "title body")
            .lean()

        if (!board) return res.status(400).json({ msg: "cannot find board" })

        if (board.postedBy.toString() === req.user._id.toString()) {
            board.permision = "Admin"
        } else {
            if (board.isPublic) {
                board.permision = "View"
            } else {
                board.permision = board.members.filter(m => m.user.toString() === req.user._id.toString())[0]?.permision || "View"
            }
        }

        board.members = ""
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
        const { members } = await Board.findById(boardId)
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
        const activityId = await activityCreator(board._id, res)

        board.activityId = activityId
        await board.save()

        await actionCreator(req.user._id, board._id, `created the board`, res)
        res.json({ id: board._id })

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

        await actionCreator(req.user._id, boardId, `added new status named ${status}`, res)
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

        await actionCreator(req.user._id, boardId, `deleted status named ${status}`, res)
        res.json({ msg: "status deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot delete the status" })
    }
})

router.put("/reorder-task", auth, async (req, res) => {
    const { boardId, status, taskId, to } = req.body

    try {
        //deleting the item
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $pull: { "tasks.$.orderedList": taskId }
        })

        // inserting the item in the position 
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $push: { "tasks.$.orderedList": { $each: [taskId], $position: to } }
        })

        res.json({ msg: "tasks reodered successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "tasks reoder operation failed" })
    }
})

router.put("/restatus-task", auth, async (req, res) => {
    const { boardId, fromStatus, toStatus, taskId, to } = req.body

    try {
        //deleting the item
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": fromStatus }, {
            $pull: { "tasks.$.orderedList": taskId }
        })

        // inserting the item in the position 
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": toStatus }, {
            $push: { "tasks.$.orderedList": { $each: [taskId], $position: to } }
        })

        const title = await taskTitle(taskId, res)
        await actionCreator(req.user._id, boardId, `task named ${title} moved from ${fromStatus} to ${toStatus}`, res)

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
    const { boardId, memId, memName, permision } = req.body
    const payload = {
        user: memId
    }

    if (permision) payload.permision = permision

    try {
        await Board.findByIdAndUpdate(boardId, {
            $push: { members: { ...payload } }
        })

        await actionCreator(req.user._id, boardId, `added new member (${memName}) to the board`, res)
        res.json({ msg: "Added member to the board successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot add a member to the board" })
    }
})

router.put("/removememb", auth, async (req, res) => {
    const { boardId, _id, memName } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, {
            $pull: { members: { _id } }
        })

        await actionCreator(req.user._id, boardId, `removed user (${memName}) from the board`, res)
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