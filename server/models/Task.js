const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String
    },

    status: {
        type: String,
        default: "To-do"
    },

    order: {
        type: Number
    },

    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    }

}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)

module.exports = Task