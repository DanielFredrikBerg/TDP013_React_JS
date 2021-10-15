const express = require('express');
const cors = require('cors')
const { Server } = require("socket.io");

const app = express();
app.use(cors({origin : "http://localhost:3000"}));
app.use(require('./routes'))

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
        socket.to(data.room).emit("recieve_message", data);
    });
  
    // Leave the room if the user closes the socket
    socket.on("leave_room", (data) => {
        console.log(`User ${socket.id} disconnected.`)
        socket.leave(data.room);
    });
});


const PORT = 3001;
const expressPort = 8080;

let expressServer
function startExpressServer(quietly = false) {
    expressServer = app.listen(8080)
    if (!quietly) {
        console.log(`Express running on port ${expressPort}`)
    }
}

function stopExpressServer(quietly = false) {
    expressServer.close() 
    if (!quietly) {
        console.log("Express server stopped")
    }  
}

let chatServer
function startChatServer(quietly = false) {
    chatServer = server.listen(PORT)
    if (!quietly) {
        console.log(`chat server is running on port ${PORT}`)
    }
}

function stopChatServer(quietly = false) {
    chatServer.close() 
    if (!quietly) {
        console.log("Chat server stopped")
    }  
}

module.exports =  {startExpressServer, stopExpressServer, startChatServer, stopChatServer}

