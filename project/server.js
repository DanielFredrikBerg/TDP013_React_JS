const cors = require('cors');
const app = require('express')();
const http = require('http');
const { Server } = require("socket.io");
app.use(cors({origin : "*"}));
app.use(require('./src/routes'));


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected.`)
    // Join a conversation
    const { roomId } = socket.handshake.query;
    
    socket.on("join_room", () => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`)
    })
  
    // Listen for new messages
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    });
  
    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected.`)
      socket.leave(roomId);
    });
  });

  const PORT = 3001;
  const expressPort = 8080;
//const server = app.listen(PORT, () => console.log(`chat server is running on port ${PORT}`))
app.listen(8080, () => console.log(`Express running on port ${expressPort}`))
server.listen(PORT, () => console.log(`chat server is running on port ${PORT}`))
//server.listen(8080, () => console.log('Server is running on http://localhost:8080'));