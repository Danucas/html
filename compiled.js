
var e = import("./@m-3dengine/engine.js");
var TerminalPromise = import('../@m-terminal/ter.js');
let terminal;
var fromMob=false;
var engine;
e.then(function(en){
//console.log(en);
	en.default.then(function(response){
		engine = response;
		
		document.getElementById("loading").style.display = 'none';			
		TerminalPromise.then(function(terminalModule){
			//console.log(terminalModule.default); 
			terminal = terminalModule.default;
			console.log('Terminal initialized');
			terminal.init(engine);
			engine.terminal = terminal;
			engine.initCamara();
			
			
		});
		//window.open('Holberton', '_self');
	});
	
});

	function joderlavida(){
		var algo = 'nada';
		function ponerAlgo(){
			return algo;
		}
	}
	var ColorPicker;
	function initColorPicker(){
		var promise = import("./@m-colorPicker/colorPicker.js");
		promise.then(function(val){
			ColorPicker = new val.default();
			ColorPicker.init();
		});

    	
		
	}
	

