const express = require('express')
const auth = require('../middlewares/auth')
const Board = require('../models/Board')

const router = express.Router()

router.get("/sharedboards", auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const userId = req.user._id

    try {
        const boards = await Board.find({ "members.user": userId })
            .select("boardName catagery postedBy")
            .populate('postedBy', "userName")
            .sort('-createdAt')
            .skip(skip)
            .limit(10)
            .lean()

        res.json({ boards })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get shared boards" })
    }
})

router.get('/public', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)

    try {
        const boards = await Board.find({ isPublic: true })
            .select('boardName catagery postedBy')
            .populate('postedBy', "userName")
            .sort('-createdAt')
            .skip(skip)
            .limit(10)
            .lean()

        res.json({ boards })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get public boards" })
    }
})

router.get("/boards", auth, async (req, res) => {
    const userId = req.user._id

    try {
        const boards = await Board.find({ postedBy: userId })
            .select('boardName catagery')
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
        const boards = await Board.find({ _id: boardId })
            .select("-members -postedBy -createdAt -__v")
            .populate("tasks", "status title")
            .sort('-createdAt')
            .lean()

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
    const { boardName, catagery } = req.body
    const userId = req.user._id

    try {
        const existBoard = await Board.findOne({ boardName, catagery, postedBy: userId })
        if (existBoard) return res.status(400).json({ msg: "Board already existed with same catagery" })

        const board = new Board({ boardName, catagery, postedBy: userId })
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