var TerminalPromise = import('./@m-terminal/ter.js');
let terminal;
TerminalPromise.then(function(terminalModule){
  //console.log(terminalModule.default); 
  terminal = terminalModule.default;
  terminal.init(this);
  console.log('Terminal initialized');
  
});

// let menuButton = document.getElementById("menu");
// let menushowing=false;








function init(){
  terminal.writeHistory("engine started")
  restartLine()
}


// menu.addEventListener("click" , abrirMenu);

// function abrirMenu(){
//   let menuList= document.getElementById("menuList");
//   if (!menushowing){
//     menuList.style.display = "block";
//     menushowing=true;
//   }else{
//     menuList.style.display = "none";
//     menushowing = false;
//   }
// }