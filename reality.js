window.addEventListener('DOMContentLoaded', ()=>{
    var arprom = import('./@m-AR/AR.js');
    arprom.then(function(mod){
        var AR = new mod.default;
        console.log(AR);
        AR.init();
    });
});