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

    tasks: {
        type: [
            {
                status: String,
                orderedList: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Task"
                }]
            }
        ],
        default: [
            {
                status: "To-do",
                orderedList: []
            },
            {
                status: "Doing",
                orderedList: []
            },
            {
                status: "Done",
                orderedList: []
            }
        ]
    },

    taskStatus: {
        type: Array,
        default: ["To-do", "Doing", "Done"],
    },

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