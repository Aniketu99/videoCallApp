const express = require("express");
const { Server } = require('socket.io');
const http = require("http");
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.send("Server started");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    
    socket.on("join-room", ({ email, roomId }) => {
        console.log(`User ${email} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", {email:email});
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
