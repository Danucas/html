
function Terminal(){
    this.writeHistory = writeHistory;
    this.addEventListener = addEventListener;
    this.init = init;
    this.assign = assign;
    this.exit = exit;
    this.info = info;
    this.terminal = terminal;
    this.StartEngine = StartEngine;
    this.setContext = setContext;
    const context = this;
    let  global_context;
    var history = new Array(); 
    var hs;
    var terminal;
    var ct = context;
    //console.log(this);
    
    function setContext(gb_context){
      writeHistory(`global_context assigned`);
      global_context = gb_context;
      return true;
    }

    function init(js){
        if(setTerminalView()){
            writeHistory(`Terminal version 0.0.1 started`);
            setContext(js);
			      addEventListener("focus", function(){
					      restartLine();
			      });
        }
        
    }

    function StartEngine(){
        writeHistory('Starting 3d engine reduced version 0.0.1');
        window.open('./engine_view.html', '_self');

    }

    


    function setTerminalView(){
        var view = `<textarea id="historic" disabled></textarea>
        <input id="terminal" placeholder="type some command">`;
        var terminalArea = document.getElementsByTagName('TERMINAL')[0];
        terminalArea.innerHTML = view;
        hs = document.getElementById('historic');
        terminal = document.getElementById('terminal');
        terminalArea.className = 'terminal';
        //console.log(`view setted ${terminal}`);
        //console.log(setCss('st.css'));
        function setCss(filename){
            var head = document.getElementsByTagName('head')[0];

            var style = document.createElement('link');
            style.href = filename;
            style.type = 'text/css';
            style.rel = 'stylesheet';
            head.append(style);
            return true;
        }

        document.addEventListener("keydown", function(e){
          commandsManager(e);
        });
        return true;
    }

    
    function assign(varPath, varValue){
      console.log(varPath, varValue);
      



      if(varPath&&varValue){
        console.log(varValue);
        ct[varPath] = varValue;
        writeHistory(`${varPath} assigned to ${ct.constructor.name}`);
        restartLine();
        //console.log(Object.entries(ct));
      }
        
    }
    function restartLine(){
        terminal.value = "$ =>";
    }
      

    function addEventListener(ev, fn){
        terminal.addEventListener("focus", function(){

            restartLine();
          
          });

        terminal.addEventListener("input",(ev)=>{
            //alert(terminal.setSelectionRange(4,4))
            //alert(terminal.value.length)
            if(terminal.value.length<4){
              terminal.value = "$ =>";
              
            }
            setTimeout(function(){
              terminal.setSelectionRange(terminal.value.length,terminal.value.length);
            },1);
        });
    }

    function writeHistory(l){
      let date = new Date();
      
      history.push([`${date.getUTCHours()}:${date.getUTCMinutes()}-${date.getUTCMilliseconds()} ${l}\n`]);
      
      
      var line="";
      for(let h of history){
        //alert(h[0]);
        line +=h[0];
        
        
      }
      hs.value= line;
      hs.scrollTop=hs.scrollHeight;
      
      return true;
    }
    function exit(){
      window.open('index.html', '_self');
    }
    function info(){
      writeHistory(`${Object.getOwnPropertyNames(ct)}`);
      restartLine();
    }
    function commandsManager(e){
      
      if(e.keyCode==13){
        var command = terminal.value.split(">")[1].split(" ");
        var options = [];

        for(let word of command){
          if(word[0]=='-'){
            options.push(word[1]);
          }
        }
        ct =context;
        if(options.length>0){
          console.log(options[0]);
          if(options[0]=='g'){
            if(global_context!=undefined){
              ct = global_context;
            }else{
              writeHistory(`Global context is not defined`);
            }
            
          }
          
        }
        
        console.log(`contexto actual ${ct.constructor.name}`)
        
        //console.log(`${Object.keys(context)}`);
        if(command[0]=="assign"||command[0]=="info"){
          var comm = command.shift();
          let values = command;
          context[comm](...values);
        }else{
          if(ct[command[0]]){
            //alert(`${command.join(" ")}\nsalomon`);
            //alert ((history.prototype))
            var comm = command.shift();
            let values = command;
            ct[comm](...values);
            restartLine();
            
           
            
            
           // alert(line);
           
            
           // ct[command[0]](command[1]);
            
          }else{
            if(global_context[command[0]]){
              var comm = command.shift();
              let values = command;
              global_context[comm](...values);
              restartLine();

            }else{
              alert(`No existe la funcion ${command[0]}`);
              restartLine();
            }
           
          }
        }
        
      
    }
  }

    

}

export default new Terminal();