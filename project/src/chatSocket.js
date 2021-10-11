/*
const server = require('../server')(server)
const io = socket(server)

const activeUsers = new Set();

io.on('connection', (socket) => {
    console.log("socket connection")

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
      });
    
      socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
      });
}) */


