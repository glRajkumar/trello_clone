const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },

    description: {
        type: String
    }

}, { timestamps: true })

const Activity = mongoose.model("Activity", activitySchema)

module.exports = Activity