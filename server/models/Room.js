const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    Admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },

    room: {
        type: String
    },

    pass: {
        type: String
    }
}, { timestamps: true })

// roomSchema.index({"expireAt":1},{expires})

const Room = mongoose.model("Room", roomSchema)

module.exports = Room