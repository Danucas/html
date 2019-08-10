setCss('st.css');

function setCss(filename){
  var head = document.getElementsByTagName('head')[0];

  var style = document.createElement('link');
  style.href = filename;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);
  return true;
}
var ObjPromise = import('./Objects.js');
var Camara, Viewport, Mesh;
console.log(Camara);



function engine(){
    this.cargarmodelo = cargarmodelo;
    this.setFPV = setFPV;
    this.mobileControl = mobileControl;
    this.setRequestedColor = setRequestedColor;
    this.aplicarColor = aplicarColor;
    this.initCamara = initCamara;
    this.acelerate = acelerate;
    this.stopMotion = stopMotion;
    this.generateWorld = generateWorld;
    console.log('engine started');
    var camara ;
    var camaras = [];
    var cam = false;
    var canvas;
    var context;
    var dx ;
    var dy;
    var scene = new Array();
    this.scene = scene;
   
    var actualObj
    var scalar =false;
    var mover = true;
    var rotar = false;
    var reqCOLOR = {r:255, g:0, b:0};
    var editMode = 'none';
    var selectedVer;
    var cliking;
    var width;
    var height;
    var log = document.getElementById('console');
    var modelo3d;
    var viewport;
    var cubo;
    var fi;
    var zoomFactor = 0.004;
    var t;
      var gl;
    //camaras y de""mas


    function initCamara(){
      camara = new Camara();
      camara.pos.z = 2;
      camara.rotation.z = 3.1416;
      camara.type = 'self';
      t = this.terminal.writeHistory;
      viewport = new Viewport();
      viewport.pos= {x:0, y:150, z:camara.pos.z+100};
      initialize3dCanvas();

    }
    function setFPV() {
       camaras[0] = [camara, viewport];
       camara = new Camara();
       camara.pos.z = 12;
       camara.pos.y = 0;
       camara.rotation.z = 3.1416;
       camara.type = 'third-p';
       t(`Object Origin in 3d coordinates:  ${scene[actualObj].getTargetOrigin()}`);
       camara.target = scene[actualObj].getTargetOrigin();
       viewport.pos= {x:0, y:150, z:camara.pos.z+100};
       scene[actualObj].camara = camara;
       renderScene(scene);

    }
    function dibujarWorldAxis(con){
      var axis_length = 100;
      var P = project([0,0,0], camara);
      con.rect(P.x+dx, P.y+dy, 1, 1);
      con.lineWidth = '1';
      con.moveTo(P.x+dx, P.y+dy);
      console.log(P);
      con.beginPath();
      for(var i=0;i<axis_length;i+=5){
        var x  = project([i,0,0], camara);
        console.log(x, y,z);

        con.strokeStyle = "blue";
        con.lineTo(x.x+dx, x.y+dy);
        con.arc(x.x+dx, x.y+dy, 1, 1, 2 * Math.PI);


      }
      con.stroke();
      con.closePath();
      con.moveTo(P.x+dx, P.y+dy);
      con.beginPath();
      for(var i=0;i<axis_length;i+=5){
        var y  = project([0,-i,0], camara);

        con.strokeStyle = "red";
        con.arc(y.x+dx, y.y+dy, 1, 1,2 * Math.PI);
        con.lineTo(y.x+dx, y.y+dy);
      }
      con.stroke();
      con.closePath();
      con.moveTo(P.x+dx, P.y+dy);
      con.beginPath();
      for(var i=0;i<axis_length;i+=5){
        var z  = project([0,0,i], camara);
        con.strokeStyle = "green";
        con.arc(z.x+dx, z.y+dy, 1, 1,2 * Math.PI);
        con.lineTo(z.x+dx, z.y+dy);
      }
      con.stroke();
      con.closePath();

      return true;
    }

    function cargarmodelo(file){
      load3dObj(file).then((mod)=>{
        //t(mod);
        var md = new Mesh(mod, file, camara);
        cubo = mod;
        fi = file;
        scene.push(md);

        rend();
      });
    }
    function rend(){
      var txt = document.getElementById('meta_AR');
      log.innerHTML = 'mover';
      txt.innerHTML = scene[actualObj].name;
      camara.target = scene[actualObj].getTargetOrigin();
      renderScene(scene);
    }


    function setCamaraK(k){
       camara.rotation ={x:k[0][0] ,y:k[1][1] ,z:[2][2] };
       camara.pos = {x:k[0][2] ,y:[1][2] ,z:k[2][2] };
    }
    function generateWorld(){
        var  cantObjs = 20;
        for(var i=0; i<cantObjs; i++){
          var newCube = new Mesh(cubo, fi+i );
          var max = 50;
          var min = 12;
          var r = Math.floor(Math.random()*(255 - 0)) + + 18;
          var g  = Math.floor(Math.random()*(255 - 0)) + + 18;
          var b  = Math.floor(Math.random()*(255 - 0)) + + 18;
          //t(r, g, b);
           var rgb ={r:r, g:g, b:b};
           var scal =  Math.floor(Math.random()*(2 - 0.6)) + + 0.6;
           var x = Math.floor(Math.random()*(30 - - 20)) + + - 20;
          var y  = Math.floor(Math.random()*(30 - - 10)) + + - 10;
          var z  = Math.floor(Math.random()*(100 - 40)) + + 40;

          newCube.ObjTranslation = {x: x , y: y, z: b};
          newCube.scala = scal;
          newCube.setColor({r:105, g:100, b:30});
          scene.push(newCube);
        }
        scene.reverse();
        actualObj = scene.length-1;
        scene[actualObj].rgb = {r: 255, g:230 , b:190 };
        renderScene(scene);


    }

    function initialize3dCanvas(){
        camaras = [];


        document.getElementById('actColor').style.backgroundColor = 'rgb('+reqCOLOR.r+','+reqCOLOR.g+','+reqCOLOR.b+')';
        canvas = document.getElementById('canvas3d');
        canvas.width  =300;
        canvas.height = 300;
        dx = canvas.width / 2;
        dy = canvas.height / 2;

        width = canvas.width;
        height = canvas.height;
        context =  canvas.getContext('2d');

        context.strokeStyle = 'rgba(86, 35, 23, 1)';
        context.fillStyle = 'rgba(255, 211, 0, 1)';

        //iniciando variables




        cam = true;
        document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
        var rotacion = new Vec([0,0,0]);
        context.clearRect(0, 0, canvas.width, canvas.height);

        camara.zoom =1.8;


        //cubo.setTranslation({x: 0, y:0, z:10});


        //var cubo2 = new Mesh(model, 'cubo2');
        sumTranslate({x:0, y:0, z:0});

        //cubo2.rgb = {r:0, g:255, b:0};



        //cubo2.scala = 15;



        actualObj = 0;

        cargarmodelo('cubo');




        function drawPoligons(faces){

          var P = project(faces[0][0], camara);
          context.moveTo(P.x+dx, P.y+dy);
          var rgb = {r:200 , g:0 , b:200 };
          for(var i=0;i<faces.length;i++){
              context.beginPath();
              context.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
              rgb = {r:rgb.r-20,g: rgb.g,b: rgb.b};
              for(var j=0;j<faces[i].length;j++){

                  var P = project(faces[i][j], camara);
                  if(P.x<300&&P.y<300){
                       context.lineTo(P.x+dx, P.y+dy);
                  }


              }
              context.stroke();
              context.closePath()
              context.fill();
              rgb = {r:rgb.r-20,g: rgb.g,b: rgb.b};

          }

        }
        var changedTouch = {
          actual:{x:0, y:0},
          last:{x:0, y:0}
        }
        var typeEvent = '';
        if(fromMob){
          typeEvent = 'touchstart';
        }else{
          typeEvent = 'click';
        }
        canvas.addEventListener(typeEvent, function(e){
                console.log('click', e);
                if(!rendering){

                  var clientx;
                  var clienty;
                  var clientWidth;
                  var clientHeight;
                  if(fromMob){
                    clientx = e.changedTouches[0].clientX;
                    clienty =e.changedTouches[0].clientY;
                    clientWidth = e.changedTouches[0].target.clientWidth;
                    clientHeight =e.changedTouches[0].target.clientHeight ;
                  }else{
                    clientx = e.clientX;
                    clienty =e.clientY;
                    clientWidth = e.target.clientWidth;
                    clientHeight =e.target.clientHeight ;
                  }
                  changedTouch.last.x = clientx;
                  changedTouch.last.y =  clienty;
                  var x = parseInt((changedTouch.last.x*width)/clientWidth, 10);
                  var y = parseInt((changedTouch.last.y*height)/clientHeight, 10);

                  console.log('revisando la cosa peluda',x, y);
                  if(editMode=='vertices'){

                    var vertices =  scene[actualObj].getVertices();
                    //t(vertices);
                    for(var i=0;i<vertices.length;i++){
                        var ver = vertices[i];
                        //t('vertice', ver, i);
                        var P = project(ver, camara);
                        //t('vertice'+i, P);
                        if((P.x+dx)>0&&(P.y+dy)>0){
                          //t(P);
                          var diferenciaX  = x-(P.x+dx);
                          var diferenciaY  = y-(P.y+dy);
                          if(diferenciaX<0){
                            diferenciaX *= -1;
                          }
                          if(diferenciaY<0){
                            diferenciaY *= -1;
                          }
                        //  t(x, y,  P, diferenciaX, diferenciaY);


                          if(diferenciaX<20&&diferenciaY<20){
                            //t(P.x+dx, P.y+dy, i);
                            selectedVer = i;
                            t("selected vert: ", i, Math.round(P.x+dx), Math.round(P.y+dy));


                            break;
                          }
                        }


                    }
                    if(selectedVer!=null){
                      renderScene(scene);
                    }

                  }
                }


        }, true);
        /*canvas.addEventListener('touchend', function(e){


                changedTouch.actual.x = e.changedTouches[0].clientX;
                changedTouch.actual.y = e.changedTouches[0].clientY;


                var diffX = changedTouch.actual.x-changedTouch.last.x;
                var diffY = changedTouch.actual.x-changedTouch.last.y;
                var iX;
                var iY;
                if(diffX<0){
                  iX = diffX*(-1);
                }else{ iX = diffX;}
                if(diffY<0){
                  iY = diffY*(-1);
                }else{ iY = diffY;}


                var average = (diffX+diffY)/2;


                if(iY>(iX+20)&&diffY<0){
                  if(changedTouch.actual.y>0){
                    sumTranslate({x:0, y:(iY/dy), z:0});

                  }

                }else if(iY>(iX+20)&&diffY>0){

                    sumTranslate({x:0, y:-(iY/dy), z:0});
                }else if(iX>(iY+20)&&diffX<0){
                   sumTranslate({x:+(iX/dx), y:0, z:0});
                }else if(iX>(iY+20)&&diffX>0){
                  sumTranslate({x:-(iX/dx), y:0, z:0});
                }
                /*
                if(changedTouch.actual.x<0&&changedTouch.actual.y<0){

                  sumTranslate({x:(average), y:(average), z:0});
                  t('T');
                }else if(changedTouch.actual.x<0&&changedTouch.actual.y>0){
                  sumTranslate({x:(diffX), y:-(diffY), z:0});
                  t('M');

                }else if(changedTouch.actual.x>0&&changedTouch.actual.y>0){

                    sumTranslate({x:-(average), y:-(average), z:0});
                  t('H');
                }else if(changedTouch.actual.x>0&&changedTouch.actual.y<0){
                    sumTranslate({x:-(diffX), y:(diffY), z:0});
                  t('W');
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                */
                //renderScene(scene);}, true);
        canvas.addEventListener( 'wheel', function(e) {
          //t('wheling')
           if(!rendering){

            context.clearRect(0, 0, canvas.width, canvas.height);
            rendering = true;
            var doZoom = false;
            if(e.deltaY<0){
                    if(scalar){
                      console.log('scalando: ', scene[actualObj].name);
                      scene[actualObj].scala += 0.01;
                    }else{
                      camara.zoom += zoomFactor;
                    }

                    doZoom = true;







            }else if(e.deltaY>0){

                  if(scalar){
                    console.log('scalando: ', scene[actualObj].name);
                      if(scene[actualObj].scala>0.01){
                        scene[actualObj].scala -= 0.01;
                      }
                      console.log('top_minimun_scala');
                    }else{
                    camara.zoom -= zoomFactor;

                  }
                    doZoom = true;


            }

            if(doZoom){

              renderScene(scene);
            }

           }

        });
        document.addEventListener('keydown', function(e){
          console.log(`%c pressed key ${e.keyCode}`, 'color: white; background: green; font-weight: bold');

            if(!rendering){
                var canMove = false;

            var rot = false;


            rendering = true;
            commandKey(e.keyCode, e.shiftKey);
          }

        });

        //render(model, context, dx, dy*/

    }


    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }


 




    var Parent = {
        pos:{x: 0, y:0, z:20}
    }

    reClick();
    var rendering = false;


    var Vector = function(coor){
        this.x = coor[0];
        this.y = coor[1];
        this.z = coor[2];
    }
    function sumarVec(vec1, vec2) {
      var newVec = {
        x: round(vec1.x+vec2.x, 4),
        y: round(vec1.y+vec2.y, 4),
        z: round(vec1.z+vec2.z, 4)
      }
      return newVec;
    }
    function restarVec(vec1, vec2) {
      var newVec = {
        x: parseFloat(vec1.x-vec2.x),
        y: parseFloat(vec1.y-vec2.y),
        z: parseFloat(vec1.z-vec2.z)
      }
      return newVec;

    }
    function dividirVec(vec1, vec2) {
      var newVec = {
        x: parseFloat(vec1.x/vec2.x),
        y: parseFloat(vec1.y/vec2.y),
        z: parseFloat(vec1.z/vec2.z)
      }
      return newVec;
    }
    function multiplicarVec(vec1, vec2) {
      var newVec = {
        x: parseFloat(vec1.x*vec2.x),
        y: parseFloat(vec1.y*vec2.y),
        z: parseFloat(vec1.z*vec2.z)
      }
      return newVec;
    }
    function dotProduct(vec1, vec2) {
      var newVec = parseFloat(vec1.x*vec2.x)+parseFloat(vec1.y*vec2.y)+parseFloat(vec1.z*vec2.z);

      return newVec;
    }


    function sumTranslate(M){
      camara.pos = sumarVec(camara.pos, M);
      viewport.pos = sumarVec(viewport.pos, M);

    }
    function sumRotate(M) {
      camara.setRotation(M);
      viewport.setRotation(M);
    }
    function translate(punto){




        var tempx = punto[0]+camara.pos.x;
        var tempy = punto[1]+camara.pos.y;
        var tempz = punto[2]+camara.pos.z;

        return [tempx, tempy, tempz];
    }


    function load3dObj(name){
      return new Promise((resolve, reject)=>{
        t(`loading ${name}`);
        var fileName = './@m-3dengine/3dAssets/pan/'+name+'.txt';
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", fileName, true);
        rawFile.onload = function (){

            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {

                    var allText = rawFile.responseText;
                    var list = allText.split('f')[0].split('v');

                    var list2 = new Array();
                    var list3 = new Array();
                    var pos;
                    list3.push([""]);
                    for(var i=0; i<list.length;i++){

                        if(list[i].split(' ')[0]=='t'){
                            if(!pos){
                                pos = i;
                            }
                            var L = list[i].replace('t ', '').split(' ');

                            var newL = new Array();
                            for(var j=1;j<4;j++){
                                newL.push(L[j]);
                            }
                            list2.push(newL);
                        }else if(list[i].split(' ')[0]=='n'){
                            var L = list[i].replace('n ', '').split(' ');
                            var newL = new Array();
                            for(var j=0;j<4;j++){
                                newL.push(L[j]);
                            }
                            list3.push(newL);

                        }
                    }


                    var fragmentList= allText.split('f')

                    var newFragmentList = new Array();
                    for(var i=1;i<fragmentList.length;i++){
                        var l = fragmentList[i].split(' ');
                        var fList = new Array();
                        for(var j=1;j<l.length;j++){
                            fList.push(l[j]);
                        }
                        newFragmentList.push(fList);
                    }
                    if(!pos){
                        pos = list.length;
                    }
                    var newList = new Array();

                    for(var i=1;i<pos;i++){
                        var I = list[i].split(' ');
                        var newI = new Array();
                        for(var j=0;j<I.length;j++){
                          if(I[j]!=''&&I[j]!=undefined){
                              newI.push(parseFloat(I[j]));
                          }



                        }

                        newList.push(newI);
                    }

                    modelo3d = [newList, newFragmentList];

                    resolve({
                        vertices: modelo3d[0],
                        faces: modelo3d[1]
                    });

                }
            }
        }
        rawFile.send();
      });


    }





    function renderScene(scena){
      //t('renderizando escena');
      camara.target = scene[actualObj].getTargetOrigin();
      rendering = true;

        context.strokeStyle = 'rgba(86, 35, 23, 1)';
        context.lineWidth = '1';
        context.clearRect(0, 0, canvas.width, canvas.height);
        //var axis = dibujarWorldAxis(context);
        t(`Camara pos: ${Object.values(camara.pos)}`);

        var objR= Object.values(scene[actualObj].ObjRotation);
        var objT = Object.values(scene[actualObj].ObjTranslation);
        console.log(`%c${scene[actualObj].name} status:` , 'background:rgb(255,100,0);color: #ffffff; font-weight: bold;')
        console.log(`position: x:${objT[0]} y:${objT[1]} z:${objT[2]}\nrotation: x:${objR[0]} y:${objR[1]} z:${objR[2]}`);
        //t('Viewport pos: ', viewport.pos);
        var object_strokeLine = 'rgba(0,0,0, 1)';
        scena.forEach(object=>{
            var rgb = object.getColor();
            context.strokeStyle = object_strokeLine;
            context.fillStyle = 'rgba('+ rgb.r+','+ rgb.g+','+ rgb.b+', 1)';
          renderMesh(object.mergeMesh(camara), context, dx, dy, [rgb.r, rgb.g, rgb.b], object.getOrigin(), object.getAxis(),object.name, object.getRaxis(0));
            //t(object.ObjTranslation);
            //t(object);
            //t(object, object.mergeMesh());
        });


        //t(, viewport.rotation);

        if(editMode=='vertices'){
          drawVertices();
        }else{
          //t('escena renderizada');
          reClick();
          rendering = false;
        }

    }
    function reClick(){
      cliking = false;
    }

    function renderMesh(faces, context, dx, dy, rgb, origin, axis, name,raxis){

        var r = rgb[0];
        var g=  rgb[1];;
        var b= rgb[2];
        var len = faces.length;
        rgb = {r:200,g: 0,b:200};

        //len =4;
        var P = project(faces[0][0], camara);
        context.moveTo(P.x+dx, P.y+dy);
        context.lineWidth = '1.4';
        //Para pintar las caras
        //determinar las normales
        for(var i=0;i<len;i++){

            
            context.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
            rgb = {r:rgb.r-20,g: rgb.g,b: rgb.b};
            //context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 0.3)';
            context.beginPath();
            for(var j=0;j<faces[i].length;j++){

                var P = project(faces[i][j], camara);




                if(P!=undefined){
                  context.lineTo(P.x+dx, P.y+dy);
                }
            }

            context.stroke();

            context.fill();
            context.closePath();
        }
        context.beginPath();
        var Or = project(origin, camara);

        context.strokeStyle = "#F0FF5C";
        context.rect(Or.x+dx, Or.y +dy,2, 2 );
        context.stroke();
        context.closePath();

        var colors = ['blue','red',  'green'];
        var ax = ['x', 'y', 'z'];
        context.lineWidth = '1';

        //t(raxis);
        //dibujar axis
        if(name==scene[actualObj].name){

          //dibujar axis de rotacion
          //se hace la projeccion de los vertices y se agregan a una lista
          var rxs=new Array();

          //drawRotationAxis(rxs, Or)

          context.beginPath();
          for(var k=0;k< raxis.length;k++){
            var rP = project(raxis[k], camara);
            rxs.push(rP);
            //t(rP.x)
            //se dibujan los puntos de los vertices
            context.strokeStyle = "rgba(233, 35, 102,1)"
            context.rect(Math.round(rP.x+dx), Math.round(rP.y+dy),2,2);
            context.stroke();

          }
          // rxs.sort(function(rx1, rx2){
          //   var x1 = rx1.x+dx, x2 = rx2.x+dx,
          //       y1 = rx1.y+dy, y2 = rx2.y+dy;
          //   var index1 =Math.round((y1 * width)+x1);
          //   var index2 =Math.round((y2 * width)+x2);
          //   return index1-index2;
          // });


          context.closePath();


          //t(`${rxs[0].x+dx}`);
          // distancias para el ellipse

          var dov1 =Math.round(Math.sqrt(Math.pow((rxs[0].x-Or.x),2)+Math.pow(rxs[0].y-Or.y,2)));
          //dov1 = Math.round(rxs[2].x-rxs[0].x);
          var dov2 =Math.round(Math.sqrt(Math.pow((rxs[2].x-Or.x),2)+Math.pow(rxs[2].y-Or.y,2)));
          //dov2 = Math.round(rxs[0].y-rxs[2].y);
          var dov3 =Math.round(Math.sqrt(Math.pow((rxs[4].x-Or.x),2)+Math.pow(rxs[4].y-Or.y,2)));
          var dov4 =Math.round(Math.sqrt(Math.pow((rxs[6].x-Or.x),2)+Math.pow(rxs[6].y-Or.y,2)));


          var dovs = {dov1, dov2, dov3, dov4};


          t(`Rotation axis distances: ${Object.values(dovs)}`);

          //Definir angulos de rotacion para los elipses
          var det = dx*0.4;

          //definir puntos cardinales
          var cardPoints = {
            nort: {
              x: Or.x+dx,
              y: Or.y-det+dy
            },
            south: {
              x: Or.x+dx,
              y: Or.y+det+dy
            },
            east:{
              x: Or.x+det+dx,
              y: Or.y+dy
            },
            west:{
              x: Or.x-det+dx,
              y: Or.y+dy
            }
          };

          var a1 = Math.round(Math.sqrt(Math.pow((cardPoints.west.x-(rxs[0].x+dx)),2)+Math.pow((cardPoints.west.y-(rxs[0].y+dy)),2)));
          var A1 = ((Math.pow(a1, 2)-Math.pow(dov1, 2)-Math.pow(det,2))/((dov1*det)*(-2)))
          A1 = Math.acos(A1);
          A1 = (Number.isNaN(A1)) ? 0:A1;
          console.log(A1);
          A1 = (rxs[0].y>Or.y)?(A1*(180/Math.PI)):0;
          A1 = 0;

          var a1P = Math.round(Math.sqrt(Math.pow(((rxs[2].x+dx)-(rxs[0].x+dx)),2)+Math.pow(((rxs[0].y+dy)-(rxs[0].y+dy)),2)));
          var A1P = ((Math.pow(a1P, 2)-Math.pow(dov1, 2)-Math.pow(det,2))/((dov1*det)*(-2)))
          A1P = Math.acos(A1P);
          A1P = (Number.isNaN(A1P)) ? 0:A1P;
          A1P = (A1P*(180/Math.PI));
          var AngDis1 = 360-A1+A1P>360?(360-A1+A1P)-360:A1P;
          t(`Distance 1 Angle: ${AngDis1}`);


          //A1 = A1>0?A1:0;
          t(`First triangle Angle: ${A1}`);
          
          //dibujar triangulo
          context.strokeStyle = 'green';
          context.beginPath();
          context.moveTo(rxs[2].x+dx, rxs[2].y+dy);
          context.lineTo(rxs[0].x+dx,rxs[0].y+dy);
          context.lineTo(Or.x+dx, Or.y+dy);
          context.lineTo(rxs[2].x+dx, rxs[2].y+dy);
          context.stroke();
          context.closePath();
          
          
          var xMin = Math.min(...[rxs[2].x+dx,rxs[0].x+dx]);
          var xMax = Math.max(...[rxs[2].x+dx,rxs[0].x+dx]);
          var yMin = Math.min(...[rxs[2].y+dy,rxs[0].y+dy]);
          var yMax = Math.max(...[rxs[2].y+dy,rxs[0].y+dy]);
         
          var O = {
            x: Math.round(((xMax-xMin)/2)+(xMin)) ,
            y: Math.round(((yMax-yMin)/2)+(yMin))
          };
          
          var radius = Math.round(Math.sqrt(Math.pow(((rxs[0].x+dx)-O.x),2)+Math.pow((rxs[0].y+dx)-O.y,2)))*2;

          

          function get_third_point_coordinates(a, b, c){
            var result = {x:0,y:0};
          
            if(a > 0){
              result.x = Math.round((c*c - b*b + a*a) / (2*a));
            }
          
            result.y = Math.round(Math.sqrt(c*c - result.x*result.x));
            result.x +=dx;
            result.y +=dy;
            return result;
          }
          
          var coordinates = get_third_point_coordinates(radius*2, radius*2, radius*2);
          console.log(`%c ${Object.values(coordinates)}`, 'color: green;');
          context.strokeStyle = 'black';
          context.rect(O.x, O.y, 2, 2);
          context.strokeStyle = 'black';
          context.rect(coordinates.x, coordinates.y, 2, 2);
          //.ellipse(O.x, O.y, radius, radius, 0, 0, 360);
          context.stroke();
          context.closePath
          
          
          //t(`crossed: ${Object.values(cross)}`);
          console.log(`%cO para el primer triangulo: ${Object.values(O)}`, 'color: blue;');



          //t(cardPoints);
           //variable determinante de los triangulos
          // var T1 =
          // var T2
          // var T3
          // var T4


          //context.moveTo(rxs[0].x+dx,rxs[0].y+dy);

      
          context.fillStyle = 'rgb(0, 0, 0)';
          var Rcolors = ['rgb(29,76,270)','rgb(255,20,170)','rgb(255,212,20)','rgb(20,255,47)'];
          context.beginPath();
          context.strokeStyle = Rcolors[0];

          //                  xposition 'centered'   yposition          width  height   angle                initangle      endangle
          context.ellipse(Math.round(rxs[2].x+dx),Math.round(rxs[0].y+dy), dov1,  dov2, ((180)*Math.PI)/180 ,(0)*Math.PI/180,(90)*Math.PI/180);
          context.fillText('x1' ,rxs[0].x+dx, rxs[0].y+dy);
          context.stroke();

          context.closePath();

          context.beginPath();
          context.strokeStyle = Rcolors[1];
          context.ellipse(Math.round(Or.x+dx),Math.round(Or.y+dy),dov2,dov3, ((270-A1)*Math.PI)/180 ,0,1.57);
          context.fillText('x2' ,rxs[2].x+dx, rxs[2].y+dy);
          context.stroke();
          context.closePath();

          context.beginPath();
          context.strokeStyle = Rcolors[2];
          context.ellipse(Math.round(Or.x+dx),Math.round(Or.y+dy),dov3,dov4, ((0-A1)*Math.PI)/180 ,0,1.57);
          context.fillText('x3' ,rxs[4].x+dx, rxs[4].y+dy);
          context.stroke();
          context.closePath();

          context.beginPath();
          context.strokeStyle = Rcolors[3];
          context.ellipse(Math.round(Or.x+dx),Math.round(Or.y+dy),dov4,dov1, ((90-A1)*Math.PI)/180 ,0,1.57);
          context.fillText('x4' ,rxs[6].x+dx, rxs[6].y+dy);
          context.stroke();
          context.closePath();


          //dibujar ;axis
          for(var i= 0;i<3;i++){

            context.beginPath();
            context.moveTo(Or.x+dx, Or.y +dy);
            context.strokeStyle = colors[i];
            context.fillStyle = colors[i];
            var s = project(axis[i], camara);
            context.lineTo(Math.round(s.x+dx), Math.round(s.y+dy));

            //t('dibujando', axis[i], s.x+dx, s.y+dy);
            context.rect(Math.round(s.x+dx), Math.round(s.y+dy), 1.4, 1.4);
            context.font = "8px Arial";
            context.fillText(ax[i], Math.round(s.x+dx), Math.round(s.y+dy));
            context.stroke();
            context.fill();
            context.closePath();
          }



        }

    }

    function drawVertices(){
      t('dibujando vertices');

      context.strokeStyle = 'rgba(247, 182, 17, 1)';
      var vertices =  scene[actualObj].getVertices();
      //t(vertices);
      //dibujando los puntos de cada vertice

      for(var i=0;i<vertices.length;i++){
        var ver = vertices[i];
          var P = project(ver, camara);
          //t(P);
          context.beginPath();
          context.lineWidth = '4';
          context.rect(P.x+dx, P.y+dy, 1, 1);
          context.font="24px Arial";
          //context.fillText(i,P.x+dx, P.y+dy);
          context.stroke();
          context.closePath();
      }

      if(selectedVer||selectedVer==0){

        var P = project(vertices[selectedVer], camara);
        var v = vertices[selectedVer];
        console.log(perspectiva(v, camara));
        console.log(camara);
        context.strokeStyle = 'rgba(6, 122, 15, 1)';
        context.beginPath();
        context.lineWidth = '4';
        context.rect(P.x+dx, P.y+dy, 1, 1);
        context.stroke();
        context.closePath();
      }

      rendering = false;
      t('escena renderizada');
    }

    function nextObj(){
        actualObj +=1;
        if(actualObj>scene.length-1){
          actualObj = 0;
        }
        t(`selected Obj:=> ${scene[actualObj].name}`);
        log.innerHTML= 'selected Obj:=>'+ scene[actualObj].name;
        document.getElementById('actColor').style.backgroundColor = 'rgb('+scene[actualObj].rgb.r+','+scene[actualObj].rgb.g+','+scene[actualObj].rgb.b+')';
    }

    function commandKey(code, shift){
      console.log(code);
      switch(code){
          case 27:
             context.clearRect(width, height, 0, 0)
             initCamara();
             break;
          case 37:
          console.log(rotar);
           //left
           if(editMode!='none'){
              if(selectedVer!=null){
                  scene[actualObj].translateVert(selectedVer, {x:0.19625 ,y:0 ,z:0}, camara);
              }

           }else{
             if(rotar){
               t('rotando camara');
                  sumRotate({x:0, y:-0.19625, z:0});
             }else{
                 sumTranslate({x:-1, y: 0, z:0});
             }


           }
           renderScene(scene);
           break;

          case 39:
             //right
             if(editMode!='none'){
                if(selectedVer!=null){
                    scene[actualObj].translateVert(selectedVer, {x:-0.19625 ,y:0 ,z:0});
                }

             }else{
               if(rotar){
                 sumRotate({x:0, y:0.19625, z:0});
               }else{
                 sumTranslate({x: 1, y: 0, z:0});
               }
             }


              renderScene(scene);
              break;
          case 38:
              if(editMode!='none'){
                  if(selectedVer!=null){
                      scene[actualObj].translateVert(selectedVer, {x:0 ,y:0.19625 ,z:0});
                      }

              }else{
                if(rotar){
                   sumRotate({x:0.19625, y:0, z:0});



                }else{
                    sumTranslate({x: 0, y: -1, z:0});
                    console.log(camara.pos);
                    //dezplazar CAMARA hacia arriba

                }
              }

                renderScene(scene);
               break;
          case 40:

              if(editMode!='none'){
                  if(selectedVer!=null){
                      scene[actualObj].translateVert(selectedVer, {x:0 ,y:-0.19625 ,z:0});
                      }

              }else{
                if(rotar){
                    sumRotate({x:-0.19625, y:0, z:0});


                }else{
                    //dezplazar CAMARA hacia abajo
                    sumTranslate({x: 0, y: 1, z:0});

                }
              }

                renderScene(scene);
               break;
          case 74:

              if(rotar){
                ///rotar objeto sobre el eje y
                scene[actualObj].setRotation({x:0, y:-0.19625, z:0});
              }else{
                //dezplazar objeto hacia la izquierda
                  scene[actualObj].setTranslation({x:-0.4, y:0, z:0});
              }

              renderScene(scene);


              break;
          case 76:
              if(rotar){
                ///rotar objeto sobre el eje y
                scene[actualObj].setRotation({x:0, y:0.19625, z:0});
              }else{
                //dezplazar objeto hacia la derecha
                scene[actualObj].setTranslation({x:0.4, y:0, z:0});
              }

              renderScene(scene);
              break;
          case 73:
              if(rotar){
                ///rotar objeto sobre el eje x
                scene[actualObj].setRotation({x:-0.19625, y:0, z:0});
              }else{
                //dezplazar objeto hacia ARRIBA
                scene[actualObj].setTranslation({x:0, y:-0.4, z:0});
              }

              renderScene(scene);
              break;
          case 75:
              if(rotar){
                ///rotar objeto sobre el eje x
                scene[actualObj].setRotation({x:0.19625, y:0, z:0});
              }else{
                //dezplazar objeto hacia abajo
                scene[actualObj].setTranslation({x:0, y:0.4, z:0});
              }

              renderScene(scene);
              break;
          case 80:
              if(scalar&&!cam){
                scene[actualObj].scala += 0.01;
              }else{
                //dezplazar objeto hacia adelante
                if(editMode!='none'){
                   if(selectedVer!=null){
                       scene[actualObj].translateVert(selectedVer, {x:0 ,y:0 ,z:0.19625});
                   }

                }else{
                    scene[actualObj].setTranslation({x:0, y:0, z:0.4});
                }

              }

              renderScene(scene);
              break;
          case 77:
              if(scalar&&!cam){
                  scene[actualObj].scala -= 0.01;
              }else{
                //dezplazar objeto hacia atras
                if(editMode!='none'){
                   if(selectedVer!=null){
                       scene[actualObj].translateVert(selectedVer, {x:0 ,y:0 ,z:-0.19625});
                   }

                }else{
                      scene[actualObj].setTranslation({x:0, y:0, z:-0.4});
                }

              }

              renderScene(scene);
              break;
          case 81:
              //alinear objeto al padre
              scene[actualObj].alignToParent();
              renderScene(scene);
              break;
          case 220:
              //seleccionar siguiente objeto
              nextObj();
              break;
          case 188:

              renderScene(scene);
              break;

          case 83:
              mover = false;
              rotar = false;
              if(!scalar){
                scalar = true;
              }else{
                scalar = false;
              }
              rendering = false;
              t(`scalar: ${scalar}`);
              log.innerHTML = 'scalar..';
              break;
          case 33:
              sumTranslate({x:0, y:0, z:-1});
              scene[actualObj].setTranslation({x:0, y:0, z:-1});
              renderScene(scene);
              break;
          case 34:
              sumTranslate({x:0, y:0, z:1});
              scene[actualObj].setTranslation({x:0, y:0, z:1});
              renderScene(scene);
              break;
          case 82:
              rotar = true;
              mover = false;
              scalar = false;
              log.innerHTML = 'rotar..';
              t(`Rotar ${scene[actualObj].name}`);
              rendering = false;
              break;
          case 84:
              rotar = false;
              mover = true;
              scalar = false;
              log.innerHTML = 'mover..';
              rendering = false;
              break;
          case 1000:
              cam = false;
              document.getElementById('camFocus').style.backgroundColor = '#424240';
              document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
              nextObj();
              break;
          case 86:
              editMode = 'vertices';
              cam = false;
              document.getElementById('camFocus').style.backgroundColor = '#424240';
              document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
              renderScene(scene);
              break;
      }
    }

    function mobileControl(code){
      console.log(`%c pressed key ${code}`, 'color: white; background: green; font-weight: bold');
      if(code==77||code==80){
        if(cam){
          if(code == 77){

            camara.zoom -= zoomFactor;
          }else{
            camara.zoom += zoomFactor;
          }
          renderScene(scene);
        }else{
          commandKey(code, false);
        }

      }else if(code==0||code==1){
        if(code ==0){
          cam = true;
          editMode = 'none';
          document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
          document.getElementById('objFocus').style.backgroundColor = '#424240';

        }else{
          cam = false;
          t(`${scene[actualObj].name} selected`);
          document.getElementById('camFocus').style.backgroundColor = '#424240';
          document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
        }

      }else if(code>36&&code<41){
        if(!cam&&editMode=='none'){
          var newCode ;
          if(code==37){
            newCode = 74;
          }else if(code ==38){
            newCode = 73;
          }else if(code ==39){
            newCode = 76;
          }else if(code == 40){
            newCode =75;
          }
          commandKey(newCode, false);
        }else{
          commandKey(code, false);
        }

      }else{
          commandKey(code, false);
      }


    }

    function offset(punto, position){

    }

    var Vec = function(arr){
      return {x:arr[0], y: arr[1], z: arr[2]};
    }

    function zoom(punto, factor){

        const scale = Math.pow(factor, 2);
        var tempx = parseFloat(punto[0]*scale);
        var tempy = parseFloat(punto[1]*scale);
        var tempz = punto[2];//parseFloat(punto[2]*scale);
        var temp = [tempx, tempy, tempz];
        return temp;

    }





    function toPoligon(punto){

    }

    function render(object, context, dx, dy){
        var vertices = object.vertices;

        for(var i=0, n_faces = object.faces.length; i<n_faces;++i){

            var face = object.faces[i];
            var P  = project(vertices[face[0][0]]);



            for(var j=0, n_vertices = face.length; j<n_vertices;++j){
                context.beginPath();
                context.moveTo(P.x +dx, P.y+dy);
                for(var vertex=0, len = face[j].length; vertex<len; ++vertex){
                    if(face[j][vertex]<vertices.length){

                        if(vertices[face[j][vertex]]!=undefined){
                            var P = project(vertices[face[j][vertex]]);
                            context.lineTo(P.x+dx, P.y+dy);
                        }

                    }
                    context.stroke();

                }
                context.closePath()

                context.fill();



            }




        }

    }

    function project(punto, camara){
        if(camara.mode=='perspective'){
          return new Vertex2D(perspectiva(punto, camara));
        }



    }

    function perspectiva(point, camara){
        var punto = zoom(translate(camara.rotate(point), camara.pos), camara.zoom);
        var tempx = ((punto[0]*viewport.pos.z)/punto[2]);//+viewport.width;
        var tempy = ((punto[1]*viewport.pos.z)/punto[2]);//+viewport.width;
        var tempz = ((punto[2]*viewport.pos.z)/punto[2]);//+viewport.width;
        var temp = [tempx, tempy, tempz];

        return new Vector(temp);


    }

    var Vertex2D = function(punto) {
        this.x = parseFloat(punto.x*width/viewport.width);
        this.y = parseFloat(punto.y*height/viewport.height);
    };

    function aplicarColor(){
      scene[actualObj].setColor(getRGB());
      renderScene(scene);
      console.log(getRGB());
    }

    function getRGB(){
      return reqCOLOR;
    }

    function setRequestedColor(rgb){
        reqCOLOR = rgb;
        document.getElementById('actColor').style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
    }



    //seccion de fisicas


    function acelerate(){
      t('Begin motion');
      scene[actualObj].acceleration = 0.6;
      scene[actualObj].velocity = 0;
      //t(obj.axis[0][2]);
      update();

    }
    var frame = 0;
    var fps = round(1000/15, 0);
    var frameRate = 15
    var upd;
    var initDif;
    function update(){
      console.log(fps);

      upd = setInterval(function(){
        var obj = scene[actualObj];
        var maxSpeed = 2;

        if(obj.velocity<maxSpeed){
          obj.velocity += round(obj.acceleration/fps, 2);

        }

        var mo = motionValues(obj.transform(obj.axis[2]), obj.transform([obj.origin.x, obj.origin.y, obj.origin.z] ));

        /*t('velocidad:', obj.velocity, '\nframe count: ', frame,
                    'axisZ pos: ', obj.transform(obj.axis[2]),
                    'obj origin: ', obj.transform([obj.origin.x, obj.origin.y, obj.origin.z]),
                    'motion values: ', mo);*/

        //t({x:obj.ObjTranslation.x+mo[0], y:obj.ObjTranslation.y+mo[1], z:obj.ObjTranslation.z+mo[2]});
        var x = round((mo.obj.x/frameRate), 2);
        var y = round((mo.obj.y/frameRate), 2);
        var z = round((mo.obj.z/frameRate), 2);

        var xc = round((mo.cam.x/frameRate), 2);
        var yc = round((mo.cam.y/frameRate), 2);
        var zc = round((mo.cam.z/frameRate), 2);


        //t('mo:',{x:x,y:y,z:z}, mo,
         //           'Obj tran: ', obj.ObjTranslation);
        scene[actualObj].setTranslation({x:x,y:y, z:z});
        //camara.pos = {x:xc,y:yc, z:zc};

        if(frame%15==0){
          console.log(frame);
          //t('mo:',{x:x,y:y,z:z});
        }

        //sumTranslate({x:mo[0],y:mo[1], z:mo[2]});
        frame ++;
        //if(!rendering){
          rendering = false;
          renderScene(scene);
        //}

      },fps );
    }
    function motionValues(axis, origin){
     // t(axis, origin);
        var xdiff = round(axis[0]-origin[0], 2);
        var ydiff = round(axis[1]-origin[1], 2);
        var zdiff = round(axis[2]-origin[2], 2);
        if(axis[0]<0){xdiff*=-1}
        if(axis[1]<0){ydiff*=-1}
        if(axis[2]<0){zdiff*=-1}
        var camDistance = 8;

        var V = [round(axis[0]-origin[0], 2),round(axis[1]-origin[1], 2),round(axis[2]-origin[2], 2)];
        var VL = Math.sqrt((Math.pow(V[0], 2)+Math.pow(V[1], 2)+Math.pow(V[2], 2)));
        var vf = [V[0]/VL, V[1]/VL, V[2]/VL ];
        var Pd = [((origin[0]+camDistance)*vf[0]),((origin[1]+camDistance)*vf[1]),((origin[2]+camDistance)*vf[2])]
        if(isNaN(Pd[0])){Pd[0]=0}
        if(isNaN(Pd[1])){Pd[1]=0}
        if(isNaN(Pd[2])){Pd[2]=0}

        console.log('axis: ', axis, 'origin: ', origin, 'camPoint: ', Pd,
                       {x: xdiff ,y: ydiff ,z:zdiff  }, scene[actualObj].ObjTranslation);
         return {cam: {x: Pd[0]  ,y:Pd[1]  ,z:Pd[2] }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } };

        /*
        if(initDif==null){
          initDif = {x: xdiff , y: ydiff , z:zdiff};
        }
        var xm = (scene[actualObj].velocity*xdiff)/initDif.x;
        var ym = (scene[actualObj].velocity*xdiff)/initDif.y;
        var zm = (scene[actualObj].velocity*xdiff)/initDif.z;



        var xcam = (camDistance*xdiff)/initDif.x;
        if(isNaN(xcam)){xcam = 0}
        var ycam = (camDistance*ydiff)/initDif.y;
        if(isNaN(ycam)){ycam = 0}
        var zcam = (camDistance*zdiff)/initDif.z;
        if(isNaN(zcam)){zcam = 0}

        xcam = round((axis[0]-camDistance)*origin[0], 2);
        ycam = round((axis[1]-camDistance)*origin[1], 2);
        zcam = round((axis[2]-camDistance)*origin[2], 2);

        //valores de la camara
        t(xcam, ycam, zcam);
        t(scene[actualObj].getTargetOrigin());
        var xc = scene[actualObj].getTargetOrigin()[0]+xcam;
        var yc  = scene[actualObj].getTargetOrigin()[1]+ycam;
        var zc  = scene[actualObj].getTargetOrigin()[2]+zcam;


        t({cam: {x: xc  ,y:yc  ,z:zc  }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } });
        return {cam: {x: xc  ,y:yc  ,z:zc  }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } };
        */
    }


    function stopMotion(){
      t('Motion stoped');
      clearInterval(upd);
      frame = 0;
    }

    
}

function getEngine(){
  return(Mesh!=undefined? engine
                   : ObjPromise.then(function(prom){
                      var Objects = new prom.default;
                      //t(Objects);
                      Camara = Objects.Camara;
                      Viewport = Objects.Viewport;
                      Mesh = Objects.Mesh;
                      //t(Camara, Mesh, Viewport);
                      return  new engine();
                    }));
    
}
export default getEngine();