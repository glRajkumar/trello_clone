const Board = require("../models/Board")

async function boardTaskAdd(boardId, status, taskId, res) {
    try {
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $push: { "tasks.$.orderedList": taskId }
        })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot add task to the board" })
    }
}

async function boardTaskDel(boardId, status, taskId, res) {
    try {
        await Board.findOneAndUpdate({ _id: boardId, "tasks.status": status }, {
            $pull: { "tasks.$.orderedList": taskId }
        })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot delete task from the board" })
    }
}

module.exports = {
    boardTaskAdd,
    boardTaskDel
}