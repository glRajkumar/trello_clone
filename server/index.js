const path = require("path")
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cors = require('cors')
const connectDB = require('./db')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = socketio(server)
connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const userControllers = require('./controllers/user')
const boardControllers = require('./controllers/board')
const sharedControllers = require('./controllers/shared')
const taskControllers = require('./controllers/task')
const roomControllers = require('./controllers/room')

app.use("/user", userControllers)
app.use("/board", boardControllers)
app.use("/shared", sharedControllers)
app.use("/task", taskControllers)
app.use("/room", roomControllers)

// Serve static assets if in production
app.use('/static', express.static(path.resolve(__dirname, 'imgs')))

// Socket IO
io.on('connection', (socket) => {
    socket.on("enter-room", ({ room }) => {
        socket.join(room)
    })

    socket.on("leave-room", ({ room }) => {
        socket.leave(room);
    })

    socket.on("update-board", ({ room, payload }) => {
        socket.broadcast.to(room).emit('update-board', payload);
    })

    socket.on("notify-room", ({ room }) => {
        socket.broadcast.emit('notify-participant', room)
    })

    socket.on("disconnect", () => {
        console.log("dis")
    })
});

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
server.listen(port, () => console.log(`App is running on ${port}`))