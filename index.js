const express = require("express");
// const htpp = require("http")
const app = express()
// const server = htpp.createServer(app)
const cors = require("cors")
const socket = require("socket.io")

app.use(express())
app.use(cors())


const server = app.listen(5000, () => console.log("Server is running on port 5000"))
const io = socket(server,{cors: true, origins:["htpp://localhost:3000"]})

io.on("connection", socket => {
    socket.emit("me", socket.id)
    // console.log(socket)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })
    socket.on("callUser", data => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })
    socket.on("answerCall", data => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
})