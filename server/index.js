const path = require("path")
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')
require('dotenv').config()

const app = express()
connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const userControllers = require('./controllers/userControllers')

app.use("/user", userControllers)

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message || "Internal Server Error"
        }
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`App is running on ${port}`))