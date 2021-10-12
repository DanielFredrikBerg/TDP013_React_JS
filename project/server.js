const express = require('express');
const cors = require('cors')
const { Server } = require("socket.io");

const app = express();
app.use(cors({origin : "*"}));
app.use(require('./src/routes'))

const server = require('http').createServer(app)


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});



io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected.`)
    
    
    
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`)
    })
  
    // Listen for new messages
    socket.on("send_message", (data) => {
        console.log('Full message:', data)
        socket.to(data.room).emit("recieve_message", data);
    });
  
    // Leave the room if the user closes the socket
    socket.on("disconnect", (data) => {
        console.log(`User ${socket.id} disconnected.`)
        socket.leave(data.room);
    });
});


const PORT = 3001;
const expressPort = 8080;
//const server = app.listen(PORT, () => console.log(`chat server is running on port ${PORT}`))
app.listen(8080, () => console.log(`Express running on port ${expressPort}`))
server.listen(PORT, () => console.log(`chat server is running on port ${PORT}`))
//server.listen(8080, () => console.log('Server is running on http://localhost:8080'));
//server.listen(3001, () => console.log(`chat server is running on port 3001`))

//module.exports = {server}