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

        boards = boards.map(({ members, ...board }) => {
            return {
                ...board,
                permision: members.filter(m => m.user.toString() === userId.toString())[0].permision
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

module.exports = router