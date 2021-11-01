const express = require("express");
// const htpp = require("http")
const app = express()
// const server = htpp.createServer(app)
const cors = require("cors")
const socket = require("socket.io")

app.use(cors())

const server = app.listen(5000, () => console.log("Server is running on port 5000"))
const io = socket(server,{cors: true, origins:["*"]})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)
	// console.log(socket.id + "\n")
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
		// console.log(data)
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})

	socket.on('error', function(error) {
		console.log(error)
	})	

	socket.on('connect_failed', function(err) {
		console.log(err)
	})
})