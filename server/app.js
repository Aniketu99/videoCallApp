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
    
    socket.on("joined-room", ({ email, roomId }) => {
        console.log(`User ${email} joined-room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", {email:email,id:socket.id});
    });

    socket.on("sendOffer", (data) => {
        const { to, offer } = data;
        io.to(to).emit("receiveOffer",{from:socket.id,offer:offer});
    });

    socket.on("sendAns",({to,Ans}) => {
        io.to(to).emit("receiveAns",{from:socket.id,Ans:Ans});
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
