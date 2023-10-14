const express = require("express")
const https = require("https")
const app = express()
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const options = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem")
};
const server = https.createServer(options,app)

const io = require("socket.io")(server, {
  cors: {
    origin: "https://frontvideochat.vercel.app",
    method: ["GET", "POST"]
  }
});

io.on("connection",(socket)=> {
    console.log(`user connected ${socket.id}`)

    socket.emit("user", uuidv4());
    
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


server.listen(5000, () => {
    console.log("Servidor corriendo en 5000")
})