const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    test: {
        type: [
            {
                name: String,
                listOrder: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Task"
                }]
            }
        ],
        default: [
            {
                name: "To-do",
                listOrder: []
            },
            {
                name: "Doing",
                listOrder: []
            },
            {
                name: "Done",
                listOrder: []
            }
        ]
    }
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test