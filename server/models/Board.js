const mongoose = require('mongoose')

const Board = mongoose.model("Board", {
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
        default: true
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

module.exports = Board