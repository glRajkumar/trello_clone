const mongoose = require('mongoose')

const Action = mongoose.model("Action", {
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    description: {
        type: String
    }
})

const activitySchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },

    actions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action"
    }]

}, { timestamps: true })

const Activity = mongoose.model("Activity", activitySchema)

module.exports = {
    Action,
    Activity
}