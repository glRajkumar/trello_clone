const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },

    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    catagery: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)

module.exports = Task