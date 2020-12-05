const express = require('express')
const auth = require('../middlewares/auth')
const Room = require('../models/Room')
const Board = require("../models/Board")

const router = express.Router()

router.get('/:id', auth, async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id).lean()
    res.json({ room })
})

router.post("/create", auth, async (req, res) => {
    const { ...details } = req.body // boardId, room, pass

    try {
        const roomExisted = await Room.findOne({ room: details.room }).select("_id").lean()
        if (roomExisted) return res.status(400).json({ msg: "room already exists with same name" })

        const room = new Room({ Admin: req.user._id, ...details })
        await room.save()

        res.json({ roomId: room._id, msg: "Board saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot create a live board room" })
    }
})

router.post("/join", auth, async (req, res) => {
    const { ...details } = req.body // room, pass

    try {
        const room = await Room.findOne({ ...details }).select("boardId").lean()
        if (!room) return res.status(400).json({ msg: "cannot find the room" })

        let board = await Board.findOne({ _id: room.boardId })
            .select("boardName catagery tasks bg")
            .populate("tasks.orderedList", "title body")
            .lean()

        board.tasks = board.tasks.map(task => {
            return {
                status: task.status,
                tasks: task.orderedList
            }
        })

        res.json({ board, roomId: room._id })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot join in the live board room" })
    }
})

router.delete("/:roomId", auth, async (req, res) => {
    const { roomId } = req.params

    try {
        await Room.findByIdAndRemove(roomId)
        res.json({ msg: "Room deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot delete the room" })
    }
})

module.exports = router