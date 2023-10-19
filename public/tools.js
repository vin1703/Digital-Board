let toolscont = document.querySelector(".tools-cont");
let optionsCont = document.querySelector(".options-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionsFlag = false;
let pencilFlag = false;
let eraserFlag = false;
//true->show tools, false-> hide tools

optionsCont.addEventListener("click",(e)=>{
    optionsFlag = !optionsFlag;
    if(optionsFlag)openTools();
    else closeTools();
     
})
function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-regular", "fa-circle-xmark");
    iconElem.classList.add("fa-solid","fa-bars");
    toolscont.style.display="flex";

}
function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-solid", "fa-bars");
    iconElem.classList.add("fa-regular", "fa-circle-xmark");
    toolscont.style.display="none";
    pencilToolCont.style.display="none";
    eraserToolCont.style.display="none";

}
pencil.addEventListener("click",(e)=>{
    pencilFlag=!pencilFlag;
    if(pencilFlag){
        pencilToolCont.style.display="block";
    }
    else{
        pencilToolCont.style.display="none";
    }
})

eraser.addEventListener("click",(e)=>{
    eraserFlag=!eraserFlag;
    if(eraserFlag)eraserToolCont.style.display="flex";
    else eraserToolCont.style.display="none";
})
upload.addEventListener("click",(e)=>{
    //open file explorer
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",(e)=>{
        let file =input.files[0];
        let url = URL.createObjectURL(file);

        let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML=`
    <div class="sticky-cont">
        <div class="header-cont">
            <div class="minimise"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img class="up" src="${url}" />
        </div>
    </div>`;

    document.body.appendChild(stickyCont);
    let minimise = stickyCont.querySelector(".minimise");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimise,remove,stickyCont);
    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
      };
      stickyCont.ondragstart = function() {
        return false;
      };

    })

    
})
sticky.addEventListener("click",(e)=>{
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class","sticky-cont");
    stickyCont.innerHTML=`
    <div class="sticky-cont">
        <div class="header-cont">
            <div class="minimise"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>
    </div>`;

    document.body.appendChild(stickyCont);
    let minimise = stickyCont.querySelector(".minimise");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimise,remove,stickyCont);
    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont,event);
      };
      stickyCont.ondragstart = function() {
        return false;
      };
})
function noteActions(minimise,remove,stickyCont){
    remove.addEventListener("click",(e)=>{
        stickyCont.remove();
    })
    minimise.addEventListener("click",(e)=>{
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display==="none")noteCont.style.display = "block";
        else noteCont.style.display="none";
    })


}
function dragAndDrop(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

      
        // centers the element at (pageX, pageY) coordinates
        function moveAt(pageX, pageY) {
          element.style.left = pageX - shiftX + 'px';
          element.style.top = pageY -  shiftY + 'px';
        }
      
        // move our absolutely positioned element under the pointer
        moveAt(event.pageX, event.pageY);
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // (2) move the element on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // (3) drop the element, remove unneeded handlers
        element.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          element.onmouseup = null;
        };

}


