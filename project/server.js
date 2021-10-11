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

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected.`)
    // Join a conversation
    const { roomId } = socket.handshake.query;
    console.log(roomId);
    
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`)
    })
  
    // Listen for new messages
    socket.on("send_message", (data) => {
        console.log('Full message:', data)
        console.log(`Room id: ${data.room}`)
        socket.to(data.room).emit("recieve_message", data);
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