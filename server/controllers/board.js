const express = require('express')
const auth = require('../middlewares/auth')
const Board = require('../models/Board')

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
        let boards = await Board.find({ _id: boardId })
            .select("-members -createdAt -__v")
            .populate("tasks", "status title body order")
            .sort('-createdAt')
            .lean()

        let tasks = boards[0].tasks
        let status = boards[0].taskStatus
        let grouped = []

        status.map(status => {
            grouped.push({
                status,
                tasks: tasks.filter(t => t.status === status)
            })
        })

        boards[0].tasks = grouped
        res.json({ boards })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get boards" })
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
    const { boardId, name } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, {
            $push: { taskStatus: name }
        })
        res.json({ msg: "new status added successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot add new status" })
    }
})

router.put("/del-status", auth, async (req, res) => {
    const { boardId, name } = req.body

    try {
        await Board.findByIdAndUpdate(boardId, {
            $pull: { taskStatus: name }
        })
        res.json({ msg: "status deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot delete the status" })
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