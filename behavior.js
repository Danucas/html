document.addEventListener('DOMContentLoaded',(event)=>{ 
    if (!indexedDB in window) {
        window.alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
        return;
    }
    
    var request = window.indexedDB.open("firstTime", 1);
    request.onupgradeneeded=(ev)=>{
        console.log(ev.target.result);
        var db = ev.target.result;
        console.log();
        if(!db.objectStoreNames.contains('done')){
            db.createObjectStore('done');
            alert('Hello'); 
        }else{
            db.createObjectStore('done');
        }

        
        
    };
    init();

    function init(){
        var thumb = document.getElementById("smart_thumbnail");
        
        
        thumb.addEventListener('mouseover',()=>{
            thumb.style.cursor = 'pointer';
        });
        thumb.addEventListener('click', ()=>{
            
            if(thumb.className=='small'){
                alert("I saw you click!");
                var bod = document.getElementsByTagName('BODY');
                bod.scrollTop = '80vw';
                thumb.className = '';
            }else{
                alert("The 'Buñuelos' will be smaller again!");
                thumb.className = 'small';
            }
            
        });
    }

    
       
        
    
});