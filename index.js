const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "https://frontvideochat.vercel.app",
    method: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Corriendo");
});

io.on("connection",(socket)=> {
    console.log(`user connected ${socket.id}`)

    socket.emit("user", socket.id);
    
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            name: data.name,
            from: data.from
      });
    });

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });


})

const PORT = 3000 

server.listen(PORT || 3000, () => {
    console.log("Servidor corriendo en 5000")
})