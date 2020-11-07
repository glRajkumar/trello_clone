let mongoose = require('mongoose')

let User = mongoose.model('User', {
    userName: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Email is not valid"]
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    token: [{ type: String }]
})

module.exports = User