const express = require("express");
const socket = require("socket.io");

const app = express();//initialize and server ready
app.use(express.static("public"));
let port = 5000;
let server = app.listen(port,()=>{
    console.log("listening to port " + port);
});

let io = socket(server);

io.on("connection",(socket)=>{
    console.log("socket connection established");

    socket.on("beginPath",(data)=>{
        io.sockets.emit("beginPath",data);
    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })
    
    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
})
