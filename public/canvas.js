// let canvas = document.querySelector("canvas");
// canvas.width=window.innerWidth;
// canvas.height=window.innerHeight;
// let pencilColorCont = document.querySelectorAll(".pencil-color");
// let pencilWidthElem = document.querySelector(".pencil-width");
// let eraserWidthElem = document.querySelector(".eraser-width");
// let mouseDown = false;
// let pencilColor = "red";
// let eraserColor = "white";
// let pencilWidth = pencilWidthElem.value;
// let eraserWidth = eraserWidthElem.value;
// let download = document.querySelector(".download");
// let redo = document.querySelector(".redo");
// let undo = document.querySelector(".undo");
// //API
// let tool = canvas.getContext("2d");
// // tool.strokeStyle="red";
// // tool.lineWidth = "4";
// // tool.beginPath();// new graphic (path)
// // tool.moveTo(10,10);//start point of line
// // tool.lineTo(100,150);//end point
// // tool.stroke();//fill color (graphic);
// // tool.lineTo(200,30);
// // tool.stroke();
// tool.strokeStyle=pencilColor;
// tool.lineWidth=pencilWidth;

// let undoRedoTracker = [];//data
// let track = 0;//tracker
// //mousedown -> startnewpath , mousemove -> path fill 
// canvas.addEventListener("mousedown",(e)=>{
//     mouseDown=true;
//     tool.beginPath();
//     tool.moveTo(e.clientX,e.clientY);
// })
// canvas.addEventListener("mousemove",(e)=>{
//     if(mouseDown){
//     tool.lineTo(e.clientX,e.clientY);
//     tool.stroke();
// }
// })
// canvas.addEventListener("mouseup",(e)=>{
//     mouseDown = false;
//     let url = canvas.toDataURL();
//     undoRedoTracker.push(url);
//     track=undoRedoTracker.length-1
// })

// undo.addEventListener("click",(e)=>{
//     if( track > 0)track--;
//     let trackObj = {
//         trackvalue : track,
//         undoRedoTracker
//     }
//     undoRedoCanvas(trackObj);

// })

// redo.addEventListener("click",(e)=>{
//     if(track < undoRedoTracker.length-1) track++;
//     //track action
//     let trackObj = {
//         trackvalue : track,
//         undoRedoTracker
//     }
//     undoRedoCanvas(trackObj);
// })

// function undoRedoCanvas(trackObj){
//     track = trackObj.trackvalue;
//     undoRedoTracker=trackObj.undoRedoTracker;
//     let url = undoRedoTracker[track];
//     let img = new Image();//new image reference element
//     img.src = url;
//     img.onload = (e) => {
//         tool.drawImage(img,0,0,canvas.width,canvas.height);
//     }
// }
// pencilColorCont.forEach((colorElem)=>{
//     colorElem.addEventListener("click",(e)=>{
//         let color = colorElem.classList[0];
//         pencilColor=color;
//         tool.strokeStyle=pencilColor;
//     })
// })

// pencilWidthElem.addEventListener("change",(e)=>{
//     pencilWidth  = pencilWidthElem.value;
//     tool.lineWidth = pencilWidth;
// })
// eraserWidthElem.addEventListener("change",(e)=>{
//     pencilColor = "white";
//     tool.strokeStyle = pencilColor;
//     eraserWidth  = eraserWidthElem.value;
//     tool.lineWidth = eraserWidth;
// })

// download.addEventListener("click",(e)=>{
//     let url = canvas.toDataURL();
//     let a = document.createElement("a");
//     a.href = url;
//     a.download = "board.jpg";
//     a.click();
// })
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthELem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthELem.value;

let undoRedoTracker = []; //data
let track = 0; // Represent which action from tracker array

// API
let tool = canvas.getContext("2d");
let mousedown = false;

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// Mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // Send data to server
    socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
    if (mousedown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
});

canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // Track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
});

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    // Track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("redoUndo", data);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // New image referance element
    
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorELem) => {
    colorELem.addEventListener("click", (e) => {
        let color = colorELem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    });
});

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
});

eraserWidthELem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthELem.value;
    tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");

    a.href = url;
    a.download = "board.jpg";
    a.click();
});

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
});

socket.on("redoUndo", (data) => {
    undoRedoCanvas(data);
})