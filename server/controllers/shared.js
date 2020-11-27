const express = require('express')
const auth = require('../middlewares/auth')
const Board = require('../models/Board')

const router = express.Router()

router.get("/boards", auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const userId = req.user._id

    try {
        let boards = await Board.find({ "members.user": userId })
            .select("boardName catagery postedBy members bg")
            .populate('postedBy', "userName")
            .sort('-createdAt')
            .skip(skip)
            .limit(10)
            .lean()

        boards = boards.map(board => {
            return {
                ...board,
                members: "",
                permision: board.members.filter(m => m.user.toString() === userId.toString())[0].permision
            }
        })

        res.json({ boards })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get shared boards" })
    }
})

router.get('/public', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)

    try {
        let boards = await Board.find({ isPublic: true, postedBy: { $ne: req.user._id } })
            .select('boardName catagery postedBy bg')
            .populate('postedBy', "userName")
            .sort('-createdAt')
            .skip(skip)
            .limit(10)
            .lean()

        boards = boards.map(board => {
            return {
                ...board,
                permision: "View"
            }
        })

        res.json({ boards })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get public boards" })
    }
})

router.get("/:boardId", auth, async (req, res) => {
    const { boardId } = req.params

    try {
        let board = await Board.find({ _id: boardId })
            .select("postedBy isPublic members tasks")
            .populate("tasks.orderedList", "title body")
            .lean()

        board = board[0]
        board.permision = !board.isPublic
            ? board.members.filter(m => m.user.toString() === req.user._id.toString())[0].permision
            : "View"

        board.tasks = board.tasks.map(task => {
            return {
                status: task.status,
                tasks: task.orderedList
            }
        })

        board.members = ""

        res.json({ board })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot gt the shared board" })
    }
})

module.exports = router