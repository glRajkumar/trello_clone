const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: true
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    catagery: {
        type: String,
        required: true
    },

    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],

    isPublic: {
        type: Boolean,
        default: false
    },

    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        permision: {
            type: String,
            default: "View"
        }
    }],

    bg: {
        isColour: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: "#fff"
        }
    }

}, { timestamps: true })

const Board = mongoose.model("Board", boardSchema)

module.exports = Board