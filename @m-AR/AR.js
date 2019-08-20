//preparando modulo de AR
//nuevos cambios para le commit
// mas cosas para cambiar
function AR(){

  this.init = init;

	function init(){
		console.log('Accesing AR MODULE');
		activarCamara();
		// getCornersFeatures(function(corners){
		// 	if(corners){
		// 		console.log(corners);
		// 		cornersFilters = corners;
		// 		console.log(`activando camara`);
		// 		activarCamara();
		// 	}else{
		// 		console.log(`pailas con los corners`);
		// 	}
		// });

	}
	var image;
	var image2
	var convolutionFrame;
	var scores;
	var width;
	var height;
	var renderCanvas;
	var cornersFilters;
	var mxPoolFilterSize = 40;
	var working;
	var convolutionAnim;
	var guardar;
	var borrar ;
	var cerrar;
	var pause;
	var frameRate = (1000/15);
	var streaming;
	var shooting;
	var title;

	function getCornersFeatures(callback){
		/*var fileName = './@m-AR/features/corners.json';


		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", fileName, true);
		rawFile.onreadystatechange = function (){

				if(rawFile.readyState === 4)
				{
						if(rawFile.status === 200 || rawFile.status == 0)
						{

								var allText = rawFile.responseText;

								var json = JSON.parse(allText);
								//console.log(json);
								callback(json);

						}
				}
		}
		rawFile.send(null);

		//features assignment
		var files = [{n:'a',ur:'./@m-AR/features/a.png'},
								 {n:'b',ur:'./@m-AR/features/b.png'},
							   {n:'c',ur:'./@m-AR/features/c.png'},
							   {n:'d',ur:'./@m-AR/features/d.png'}//,
							   //{n:'e',ur:'./@m-AR/features/e.png'}
							 ];
		var features = new Array();
		var pos = 0;




		getFile(pos);
		*/
		



		//lee los filtros y los asigna a vectores 1d

		function getFile(pos){
			var getPixels = new Promise((resolve, reject)=>{
				console.log('loading extractive feature: ', files[pos].n, "...");
				var image = document.createElement('img');
				image.src=files[pos].ur;
				image.onload = function(){
					 var cn = document.createElement('canvas');
					 var ct = cn.getContext('2d');
					 ct.drawImage(image, 0, 0);

					 var px = ct.getImageData(0, 0, mxPoolFilterSize, mxPoolFilterSize);
					 px = Array.prototype.slice.call(px.data);
					 //console.log(px);
					 var finPx = new Array();
					 for(var k=0;k<px.length;k+=4){
						 finPx.push(px[k]);
					 }
					 features.push({name:files[pos].n, pixels: finPx});
					 console.log('loaded');
					 resolve(files[pos].n);

				}
			});
			getPixels.then(function(response){
				console.log(response);
				 pos++;

				 if(pos< files.length){
					 	getFile(pos);
				 }else{
					  callback(features);
				 }

			});
		}






	}



	function activarCamara(){
        //console.log('iniciando');
				var v = setVideoView();
				var view = document.getElementById('camera_cont');
        v.style.display = 'block';
        var player = document.getElementById('player');
        var snapshotCanvas = document.getElementById('snapshot');
				renderCanvas = snapshotCanvas;
        var captureButton = document.getElementById('capture');
        var guardar = document.getElementById('changeCamera');
        var borrar = document.getElementById('startCamera');
				var cerrar = document.getElementById('closeCamara');
				title = document.getElementById('camera_title')

        image = document.getElementById('photoImg');
				image2  =document.getElementById('photoImg2');
        cerrar.addEventListener('click', cerrarCamara);
        borrar.addEventListener('click', iniciarCamara);
        guardar.addEventListener('click', guardarFoto);
        captureButton.addEventListener('click', initConvolution);
				




        var front = false;


        navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


        var devices = new Array();
        var actualDevice = 0;
        var snap;

				var loop;
        if(!navigator.getMedia){
            displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        }
        else{


            navigator.getUserMedia({video:{facingMode:"environment"}},
            function(stream){
                player.srcObject = stream;
                window.localStream =stream;
                streaming = stream;
                player.play();
                player.onplay = function(){
                    shooting = true;
                    




                }

            },function(err){
                
                console.log(err);
            });
        }
        var MARKERS = new Array();

        //var loop = setInterval(initConvolution, 2);



    function compare(){
        	clearInterval(loop);
        	for(var i=0; i<10;i++){
        		getComparacionImagenFromFile('./@m-AR/AR_assets/marcador_'+i.toString()+'.png');
        	}
        	setTimeout(function(){
						loop = setInterval(initConvolution, 2);
					}, frameRate);

  		}
        var file_pos = 0;
        function getComparacionImagenFromFile(path){
        	var img = document.createElement('img');
        	img.onload = function(){
        		dibujar(img, file_pos);
        		file_pos ++;
        	};
        	img.src = path;
        }
        function dibujar(obj, pos){
        	var canvas = document.createElement('canvas');
        	canvas.setAttribute('id', 'subCanvas'+pos.toString());
        	canvas.width = 300;
        	canvas.height = 300;
        	var contx = canvas.getContext('2d');
        	contx.drawImage(obj, 0, 0);
        	var imageData = contx.getImageData(0, 0, 300, 300);
        	var li = document.createElement('li');
        	li.appendChild(canvas);
        	document.getElementById('canvasList').appendChild(li);

        	var newData = filtroBN(canvas.getContext('2d'), true);
        	MARKERS.push(Array.prototype.slice.call(newData.data));
        	contx.putImageData(newData, 0, 0);



        }

        function errorHandling(err){
           console.log(err)
        }
        function cerrarCamara(){
            //document.getElementById("camera_cont").style.display = "none";
            //document.getElementById("camera_cont").innerHTML = "";
            //player.pause();
            shooting = false;
						if(streaming){
                streaming.getVideoTracks()[0].stop();
            }
						stop();


        }
		function stop(){
			clearInterval(loop);
		}

		function pausar(){
			title.innerHTML = 'Pausa II';
			pause.style.color = 'white';
			clearInterval(loop);
			pause.style.color = 'grey';


		}

    function initConvolution(){
			working = false;
			setTimeout(function(){
					loop = setInterval(takingFrame, frameRate);
			}, frameRate);
			//console.log('tomando imagen');
			//takingFrame();

		}
		function takingFrame(){
						//console.log('taking snap');
						title.innerHTML = 'iniciando Cconvolucion...';
						if(!working){
							//working = true;
							if(convolutionAnim){
								clearInterval(convolutionAnim);
							}


							var context = snapshotCanvas.getContext('2d');

	            width = player.videoWidth;
	            height = player.videoHeight;
							//console.log(width, height);
							snapshotCanvas.style.display = 'none';
							if (width && height) {

	                // Setup a canvas with the same dimensions as the video.
	                snapshotCanvas.width = width;
	                snapshotCanvas.height = height;

	                // Make a copy of the current frame in the video on the canvas.
	                context.drawImage(player, 0, 0, width, height);




	            }

							var input = snapshotCanvas.getContext('2d').getImageData(0, 0, width, height);
							//console.log('greyscaling');
							var newLines = filtroEscalaDeGrises(input,width,height);
							//console.log( Array.prototype.slice.call(newLines.data));
							//console.log('escala de grises done');

							//context.putImageData(newLines, 0, 0);
							//image.src = snapshotCanvas.toDataURL();
							//title.innerHTML = 'dibujando escala de grises...';
							//console.log('BN filter');

							



							////console.log(cornersFilters);
									//console.log('comparing features');
							var markerFeatures = compareFeats(newLines, cornersFilters);
							//title.innerHTML = 'comparando features...';
							//console.log(markerFeature
							var can = document.createElement('canvas');
							can.width = width;
							can.height = height;
							var ct = can.getContext('2d');
							context.strokeStyle = '#f48f42';
							context.fillStyle = '#f48f42';
							context.clearRect(0, 0, width, height);
							snapshotCanvas.style.display = 'block';
							

							var coordinates = normalizeCoordinates(markerFeatures);
							title.innerHTML = 'normalizando coordenadas...';
							//console.log(coordinates);
							if(coordinates!=undefined){
								var somevalue = [[10, 10, 1],[10, 10, 1],[10, 10, 1],[10, 10, 1]];
								//var h = get8DofFilter(coordinates, somevalue);
								if(coordinates.length>3){
									context.strokeStyle = 'green';
									context.lineWidth = 8;
									context.beginPath();
									var fs = 15;
									context.strokeStyle = 'green';
									context.lineWidth = 8;
									context.moveTo(coordinates[0].coord.x+(mxPoolFilterSize/2), coordinates[0].coord.y+(mxPoolFilterSize/2) );
									context.lineTo(coordinates[1].coord.x+(mxPoolFilterSize/2), coordinates[1].coord.y+(mxPoolFilterSize/2));
									context.lineTo(coordinates[2].coord.x+(mxPoolFilterSize/2), coordinates[2].coord.y+(mxPoolFilterSize/2));
									context.lineTo(coordinates[3].coord.x+(mxPoolFilterSize/2), coordinates[3].coord.y+(mxPoolFilterSize/2));
									context.lineTo(coordinates[0].coord.x+(mxPoolFilterSize/2), coordinates[0].coord.y+(mxPoolFilterSize/2));
									context.closePath();
									context.stroke();
									context.font = "30px sans-serif";
									context.strokeStyle = 'black';
									context.lineWidth = 0.4;
									for(var i=0;i<coordinates.length;i++){
										context.fillText(coordinates[i].name, coordinates[i].coord.x+(mxPoolFilterSize/4)-fs, coordinates[i].coord.y+(mxPoolFilterSize/1.4)-fs, 12 );
										context.strokeText(coordinates[i].name, coordinates[i].coord.x+(mxPoolFilterSize/4)-fs, coordinates[i].coord.y+(mxPoolFilterSize/1.4)-fs, 12 );

									}
									title.innerHTML = 'dibujando punto del centro...';
									drawCenterPoint(coordinates, context);


								}


							}



							working = false;

						}







						/*
						var verticalEdgeFilter = [3, 0, -3, 10, 0, -10, 3, 0, -3];
						var verticalInverseEdgeFilter = [-3, 0, 3, -10, 0, 10, -3, 0, 3];
						var horizontalEdgeFilter = [3, 10, 3, 0, 0, 0, -3, -10, -3];
						var horizontalInverseEdgeFilter = [-3, -10, -3, 0, 0, 0, 3, 10, 3];
						var normalize = [1, 1, 1, 1, 1, 1, 1, 1, 1];
						var VNedges =	convolution3x3(newLines.data, verticalEdgeFilter);
						var VIedges = convolution3x3(newLines.data, verticalInverseEdgeFilter);
						var HNedges = convolution3x3(newLines.data, horizontalEdgeFilter);
						var HIedges = convolution3x3(newLines.data, horizontalInverseEdgeFilter);
						//console.log('convolving done');
						var layers = toArrays([VNedges, HNedges]);
						//console.log('arrays done');
						var merged = mergeLayers(layers);
						//var normalized  = convolution3x3(merged, normalize);
						var BN = filtroBN(merged);
						var YOLO = MaxPool(BN);

						console.log(YOLO);
						//console.log('merged done');
						var can = document.createElement('canvas');
						can.width = YOLO.w;
						can.height = YOLO.h;
						var ct = can.getContext('2d');


						var pos = 0;
						var anim = setInterval(function(){

							var dat = ct.createImageData(YOLO.w, YOLO.h);
							dat.data.set(YOLO.list[pos]);
							ct.putImageData(dat, 0, 0);
							image2.src = can.toDataURL();
							pos++;
							if(pos>=YOLO.list.length){
								pos = 0;
							}
						},600);



						setTimeout(function(){
								loop = setInterval(initConvolution, 2);
						}, 2);
						*/
						//console.log(Array.prototype.slice.call(edges));
						//context.putImageData(newLines, 0, 0);
						//image.src = snapshotCanvas.toDataURL();








    }
		function drawCenterPoint(coords, ctx){
			var x1  = coords[3].coord.x;
			var y1  = coords[3].coord.y;
			var x2  = coords[1].coord.x;
			var y2  = coords[1].coord.y;
			var x3  = coords[0].coord.x;
			var y3  = coords[0].coord.y;
			var x4  = coords[2].coord.x;
			var y4  = coords[2].coord.y;
			var norRate  = 15;
			var Px = Math.round((((x1*y2)-(y1*x2))*(x3-x4)-(x1-x2)*((x3*y4)-(y3*x4)))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)));
			var Py = Math.round((((x1*y2)-(y1*x2))*(y3-y4)-(y1-y2)*((x3*y4)-(y3*x4)))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)));
			ctx.strokeStyle = 'green';

			ctx.fillRect(Px+norRate, Py+norRate, 4, 4);

			var a_1 = [(((x2-x3)/2)+(x3)), (((y2-y3)/2)+y3)];
			var a_2 = [(((x4-x1)/2)+(x1)), (((y4-y1)/2)+y1)];
			ctx.font = "18px sans-serif";
			ctx.fillStyle = 'blue';
			ctx.fillRect(a_1[0]+norRate, a_1[1]+norRate, 4, 4);
			ctx.fillText('A1', a_1[0]+norRate, a_1[1]+norRate);
			ctx.fillRect(a_2[0]+norRate, a_2[1]+norRate, 4, 4);
			ctx.fillText('A2', a_2[0]+norRate, a_2[1]+norRate);
			ctx.strokeStyle = 'white';
			ctx.lineWidth = '2';

			ctx.strokeText('A1', a_1[0]+norRate, a_1[1]+norRate);
			ctx.strokeText('A2', a_2[0]+norRate, a_2[1]+norRate);
			//console.log(Px, Py, a_1, a_2);

			//dibujando rectas desde el punto del centro
			ctx.lineWidth = '4';
			ctx.strokeStyle = 'blue';
			ctx.beginPath();
			ctx.moveTo(Px+norRate, Py+norRate);
			ctx.lineTo(a_1[0]+norRate, a_1[1]+norRate);
			ctx.closePath();
			ctx.stroke();
			ctx.lineWidth = '4';
			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.moveTo(Px+norRate, Py+norRate);
			ctx.lineTo(a_2[0]+norRate, a_2[1]+norRate);
			ctx.closePath();
			ctx.stroke();



		}

		function get8DofFilter(tracked, model){

				//conviritendo el vector a 1d
				var A = new Array();
				var B = new Array();

				var BPrime = new Array();
				for(var i=0;i<tracked.length;i++){
					B.push(tracked[i][0]);
					B.push(tracked[i][1]);
					BPrime.push(1/tracked[i][0]);
					BPrime.push(1/tracked[i][1]);
					A.push([model[i][0],model[i][1],1,0,0,0,-(model[i][0]*tracked[i][0]),-(model[i][1]*tracked[i][0]) ]);
					A.push([0, 0, 0, model[i][0], model[i][1], 1, -(model[i][0]*tracked[i][1]), -(model[i][1]*tracked[i][1])]);
				}

				//multiplicando las matrices
				var h = new Array();
				var row = new Array();
				for(var i=0; i<BPrime.length;i++){
					var sum = 0;
					var bk = BPrime[i];
					for(var k=0;k<A[i].length;k++){
						sum += A[i][k]*BPrime[k];
					}

					row.push(sum);
					if(i==2||i==5){
						h.push(row);
						row = new Array();
					}else if(i==7){
						row.push(1);
						h.push(row);
					}
				}


				//estimating pose from homography
				var r3 = multiplicarVec(h[0], h[1]);
				var K = [[h[0][0], 0, 0, h[0][2]],[0,h[1][1],0, h[1][2]], [0,0,r3, h[2][2]], [-h[2][0], -h[2][1],-h[2][2], 1]];





				//console.log(K, h);
				return h;





		}
		function multiplicarVec(vec1, vec2) {
			var newVec =
				(vec1[0]*vec2[0])+
				(vec1[1]*vec2[1])+
				(vec1[2]*vec2[2])
      ;
			return newVec;
		}


		function normalizeCoordinates(featuresCoord){
			//console.log('normalizing coordinates');
			 var filter = [];
			 var checker = [false, false, false, false];

			 for(var i=0;i<featuresCoord.length;i++){
				 var name = featuresCoord[i].name;

				 if(name =='a'&&!checker[0]){
					 filter[0] = featuresCoord[i];
					 checker[0]  = true;
					 //console.log(featuresCoord[i].name);
				 }else if(name =='b'&&!checker[1]){
					 filter[1] = featuresCoord[i];
					 checker[1]  = true;
				 }else if(name =='c'&&!checker[2]){
					 filter[2] = featuresCoord[i];
					 checker[2]  = true;
				 }else if(name =='d'&&!checker[3]){
					 filter[3] = featuresCoord[i];
					 checker[3]  = true;
				 }



			 }
			 //console.log(filter);
			 if(filter.length>3){

					/*for(var i=0;i<filter.length;i++){
						filter[i].coord.x =Math.round(( filter[i].coord.x*300)/640);
						filter[i].coord.y = Math.round(( filter[i].coord.y*300)/480);


					}*/
					return filter;
			 }else{
				 return 0;
			 }

		}


		var processingData = false;
		function toArrays(lista){
			console.log(lista);
			var nuevaLista = new Array();
			for(var i=0;i<lista.length;i++){
				nuevaLista.push(Array.prototype.slice.call(lista[i].array));
			}
			return nuevaLista;


		}
		function mergeLayers(layers){
			 var layer1 = layers[0];
			 //console.log(layers);
			 for(var j=1; j<layers.length;j++){
					 	   for(var k=0; k<layers[j].length; k++){
								  var p = layers[j][k];
								  if(p!=0){
											layer1[k] = parseInt((layer1[k]+p)/2, 10);
								  }
							 }


			}

			 var Uint = new Uint8ClampedArray(width*height*4);
			 for(var i=0;i<layer1.length;i++){
				 Uint[i] = layer1[i];
			 }
			 return Uint;
		}
		function filtroEscalaDeGrises(poolingSeccion, w, h){

			var newLines = new Array();
			var rgb_pos  = 0;


			var dat  =  Array.prototype.slice.call(poolingSeccion.data);
			//var rangos = new ColorPicker().getRange();


			for(var i=3; i<dat.length;i+=4){

					var r = dat[i-3];
					var g = dat[i-2];
					var b = dat[i-1];
					/*if(r<g&&r<b){
						r *= (30/100);
						g *= (30/100);
						b *= (30/100);
					}else if(g>r&&g>b){
						r *= (30/100);
						g *= (30/100);
						b *= (30/100);
					}else if(b>r&&b>g){
						r *= (30/100);
						g *= (30/100);
						b *= (30/100);
					}*/
					var average = (r+g+b)/3;
					var level = 90;
					r = average;
					g = average;
					b = average;



					newLines.push(parseInt(r, 10));
					newLines.push(parseInt(g, 10));
					newLines.push(parseInt(b, 10));
					newLines.push(255);




			}

			var newData = new Uint8ClampedArray(w* h *  4);
			for(var i=0;i<newLines.length;i++){
				newData[i] = newLines[i];
			}


			poolingSeccion.data.set(newData);




			return poolingSeccion;




		}
		function compareFeats(pooling, features){
			 //console.log('getting pooling patches');
			 var matchedPool = MaxPool(pooling, features);
			 //console.log(matchedPool
			 var sensitive = 80;
			 function compareFeatures(el, features){

				 var res = new Array();
				 var m;
				 for(var fIN=0;fIN<features.length;fIN++){
					 var feat = features[fIN];
					 var sum = 0;
					 for(var i=0; i<el.length;i++){
						 if(el[i]==feat.pixels[i]){
							 sum += 100/(mxPoolFilterSize*mxPoolFilterSize);
						 }

					 }
					 if(sum>sensitive){

						 m = feat.name;
					 }

				 }
				 if(m){
					 console.log(m);
					 return m;
				 }else{
					 return false;
				 }





			 }
			 var can = document.createElement('canvas');
			 can.width = mxPoolFilterSize;
			 can.height = mxPoolFilterSize;
			 var ct = can.getContext('2d');
			 var context = renderCanvas.getContext('2d');


			 var p=0;
			 //console.log('convul animation start');
			 /*convolutionAnim = setInterval(function(){
				 ct.clearRect(0, 0, mxPoolFilterSize, mxPoolFilterSize);
				 var newU =new Uint8ClampedArray(mxPoolFilterSize*mxPoolFilterSize*4);
				 var trArray = new Array();
				 for(var j=0;j<matchedPool[p].pixels.length;j++){
					 trArray.push(matchedPool[p].pixels[j]);
					 trArray.push(matchedPool[p].pixels[j]);
					 trArray.push(matchedPool[p].pixels[j]);
					 trArray.push(255);
				 }
				 for(var f=0;f<trArray.length;f++){
					 newU[f] = trArray[f];
				 }
				 //console.log(newU);
				 var dat = ct.createImageData(mxPoolFilterSize, mxPoolFilterSize);
				 dat.data.set(newU);
				 ct.putImageData(dat, 0, 0);

				 //context.strokeStyle = '#56f442';
				 //context.clearRect(0, 0, width, height);

				 //context.rect(matchedPool[p].coord.x, matchedPool[p].coord.y, mxPoolFilterSize, mxPoolFilterSize);
				 //context.stroke();
				 //console.log(matchedPool[p].coord);
				 image.src = can.toDataURL();
				 p++;
				 if(p>=matchedPool.length){
					 clearInterval(convolutionAnim);
					 var toas = new Toasty();
					 toas.show('Convolution finished', 1000);
				 }
			 }, 6);*/



			 /*
			 var matchingFeats = new Array();
			 console.log('matching features 1 by 1');
			 for(var i=0;i<matchedPool.length;i++){
				 var response  = compareFeatures(matchedPool[i].pixels , features);



				 if(response){
					 var exists = false;
					 for(var k=0;k<matchingFeats.length; k++){
						 if(matchingFeats[k].n==response){
							 exists = true;
						 }
					 }
					 if(!exists){
						 matchingFeats.push({n: response, coord: matchedPool[i].coord});
					 }


				 }
			 }*/
			 return matchedPool;

		}
		function MaxPool(data, features){
				var lista = Array.prototype.slice.call(data);
				var w1 = (width/mxPoolFilterSize);
				var w2 = (height/mxPoolFilterSize);
				var filterWidth = width/w1;
				var filterHeight = height/w2;
				var filterLenght = filterWidth*filterHeight;
				var patches = new Array();
				var pixels = new Array();
				for(var i= 0; i<lista.length;i+=4){
						pixels.push([data[i], data[i+1],data[i+2],data[i+3] ]);
				}


			 var sensitive = 90;
 			 function compareFeatures(el, features){

 				 var res = new Array();
 				 var m;
 				 for(var fIN=0;fIN<features.length;fIN++){
 					 var feat = features[fIN];
 					 var sum = 0;
 					 for(var i=0; i<el.length;i++){
 						 if(el[i]==feat.pixels[i]){
 							 sum += 100/(mxPoolFilterSize*mxPoolFilterSize);
 						 }

 					 }
 					 if(sum>sensitive){

 						 m = feat.name;
 					 }

 				 }
 				 if(m){
 					 return m;
 				 }else{
 					 return false;
 				 }





 			 }
				//console.log(pixels.length);
				var intervalos = 10;
				for(var y=0;y<height-filterHeight;y+=intervalos){
					for(var x=0;x<width-filterWidth;x+=intervalos){
						var p = (width*y)+(x);
						var poolPatch = new Array();
						for(var ly=0;ly<filterHeight;ly++){
							for(var lx=0;lx<filterWidth;lx++){

								var pos = (p)+(width*ly)+lx;
								//poolPatch.push(pos);

								poolPatch.push(pixels[pos][0]);


							}
						}

						var match = compareFeatures(poolPatch, features);
						if(match){
							//console.log(match);
							var exists = false;
	 					 	for(var k=0;k<patches.length; k++){
	 						 	if(patches[k].name==match){
	 							 	exists = true;
	 						 	}
	 					 	}
	 					 	//if(!exists){
	 						 	patches.push({name: match , coord:{x:x+1 , y:y+1 }});
	 					 	//}

						}

						/*var newU =new Uint8ClampedArray(filterWidth*filterHeight*4);
						var patch = [];
						for(var s=0;s<poolPatch.length;s++){
							newU[s] = poolPatch[s];
							patch.push(poolPatch[s][0]);
						}
						patches.push({pixels: patch, coord:{x:x+1 , y:y+1 }});
						*/

					}

				}


				return patches;
		}
		function convolution3x3(pooling, features){
				var lista = Array.prototype.slice.call(pooling);
				//console.log(lista);


				function matchEl(coor, porcentaje){
					 return [coor, porcentaje];
				}

				function edgeFilter(el, filter){
						var res = new Array();
						for(var i=0; i<el.length;i++){
							res.push(el[i]*filter[i]);
						}
						var sum = 0;
						for(var i=0; i<res.length;i++){
							sum+=res[i];
						}

						return sum;

				}
				function compareFeatures(el, features){
					var res = new Array();
					var m;
					for(var fIN=0;fIN<features.length;fIN++){
						var feat = features[fIN];
						var sum = 0;
						for(var i=0; i<el.length;i++){
							if(el[i]==feat.pixels[i]){
								sum += 11.1;
							}

						}
						if(sum>90){
							//console.log(feat.name);
							m = feat.name;
						}

					}
					if(m){
						return m;
					}else{
						return false;
					}





				}





				var pixels = new Array();
				//estableciendo Z de todos los pixels
				for(var i=0; i<lista.length;i+=4){
						pixels.push(lista[i]);
				}


				var convW = width+2;
				var convH = height+2;
				var len = convW*convH;
				var Yp = 0;
				var nL = new Array(convW*convH);


				for(var i=0;i<convW;i++){
					nL[i] = 0;
				}
				for(var i=1;i<convH;i++){
					var po1 = convW * i;
					var po2 = (convW*i)+(width+1);
					nL[po1] = 0;
					nL[po2] = 0;
					for(var j=width*i;j<(width*i)+width;j++){
						nL[po1+(j-po1)]  = pixels[j];
					}


				}
				////console.log(nL);
				pixels =  nL;
				//console.log(pixels);

				//aplicando la convolucion
				var maxPool = new Array();
				var Rs = new Array();//resultado;
				var matchingFeats = new Array();

				for(var y=0; y<convH;y++){
					for(var x=1;x<convW+1;x++){
							var pool = new Array();
							var volPos = x*y;
							//extrayendo los pixels
							pool.push(pixels[(convW*y)+(x-1)]);//1
							pool.push(pixels[(convW*(y))+(x)]);//2
							pool.push(pixels[(convW*(y))+(x+1)]);//3
							pool.push(pixels[(convW*(y+1))+(x-1)]);//4
							pool.push(pixels[(convW*(y+1))+(x)]);//5
							pool.push(pixels[(convW*(y+1))+(x+1)]);//6
							pool.push(pixels[(convW*(y+2))+(x-1)])//7;
							pool.push(pixels[(convW*(y+2))+(x)]);//8
							pool.push(pixels[(convW*(y+2))+(x+1)]);//9
							//aplicando el filtro de la convolucion

							var response  = edgeFilter(pool, features);


							/*if(response){
									matchingFeats.push(response);
								//matchingFeats.push({n: response, coord:{x: x, y: y+1}});
							}else{
							*/
								matchingFeats.push(response);
								matchingFeats.push(response);
								matchingFeats.push(response);
								matchingFeats.push(255);
								/*var coor = new Array();

								coor.push((convW*y)+(x-1));//1
								coor.push((convW*(y))+(x));//2
								coor.push((convW*(y))+(x+1));//3
								coor.push((convW*(y+1))+(x-1));//4
								coor.push((convW*(y+1))+(x));//5
								coor.push((convW*(y+1))+(x+1));//6
								coor.push((convW*(y+2))+(x-1));//7
								coor.push((convW*(y+2))+(x));//8
								coor.push((convW*(y+2))+(x+1));//9
								coor.push('y: '+ y);
								coor.push('x: '+x);

								maxPool.push(coor);
							//}

							//console.log('pool:', x, y, response, pool);*/


					}
				}
				//console.log(maxPool);
				if(matchingFeats.length>0){
					var newUint = new Uint8ClampedArray(width*height*4);
					for(var i=0;i<matchingFeats.length;i++){
						newUint[i] = matchingFeats[i];
					}
						return {array:newUint, type: "feature"};
				}else{
				var pix = new Array();
				for(var i=0;i<pixels.length;i++){
					pix.push(pixels[i]);
					pix.push(pixels[i]);
					pix.push(pixels[i]);
					pix.push(255);
				}

				var newUint = new Uint8ClampedArray(width*height*4);
				for(var i=0;i<Rs.length;i++){
					newUint[i] = Rs[i];
				}

				//console.log(newUint);
				/*for(var i=0;i<Rs.length;i++){
					newUint[i] = Rs[i];
				}*/



				return newUint;
				//return {array:newUint, type: "filter"};
			}









		}

		function filtroBN(pooling){


				processingData = true;
				var dat = Array.prototype.slice.call(pooling);

				var newLines = new Array();
				var rgb_pos  = 0;
				var pixelSum = 0;
				var newData = new Uint8ClampedArray(width * height *  4);

				for(var i=0; i<dat.length;i++){
					if(rgb_pos==0||rgb_pos==1||rgb_pos==2){
						pixelSum = pixelSum+dat[i];
						rgb_pos ++;
					}else if(rgb_pos==3){
						var r = dat[i-3];
						var g = dat[i-2];
						var b = dat[i-1];

						if(pixelSum>300){
							newLines.push(255);
							newLines.push(255);
							newLines.push(255);
							newLines.push(255);
						}else {
							newLines.push(0);
							newLines.push(0);
							newLines.push(0);
							newLines.push(255);
						}
						pixelSum = 0;
						rgb_pos = 0;
					}

				}


				for(var i=0; i<newLines.length;i++){
					newData[i] = newLines[i];

				}

				return newData;






		}
		var is = false;
		function compareImages(newLines, pos){
			var range = newLines.length;
			var comp_rang = 0;
			var whitePix_rang = 0;
			for(var i =0; i<MARKERS[pos].length; i++){
				if(MARKERS[pos][i]==0){
					comp_rang ++;
				}else{
					if(newLines[i]%4!=1){
						whitePix_rang ++;
					}

				}
			}

			var input_rang = 0;
			var whitePix = 0;

			for(var i =0; i<newLines.length; i++){

				if(newLines[i]==0){
					if(newLines[i]==MARKERS[pos][i]){
						input_rang ++;
					}
				}else{
					if(newLines[i]%4!=1){
						whitePix ++;
					}

				}


			}

			var whitePercent =  parseInt((whitePix*100/whitePix_rang), 10);
			var percent = parseInt((input_rang*100/comp_rang), 10);
			var compPercent = 74;
			var complex_percent = (whitePercent + percent)/2;
			//console.log(whitePercent, percent, 'marker: ',pos);
			return { x: whitePercent, y: percent};








		}


		function setMarker(){
			clearInterval(loop);

			console.log('setting marker')

			context = snapshotCanvas.getContext('2d');
			context.fillStyle = "#ffffff";
			var list = context.getImageData(0,0, 200, 200);
			var dat = Array.prototype.slice.call(list.data);

			var newLines = new Array();
			var rgb_pos  = 0;
			pixelSum = 0;
			newData = new Uint8ClampedArray(200 * 200 *  4);

			for(var i=0; i<dat.length;i++){
				if(rgb_pos==0||rgb_pos==1||rgb_pos==2){
					pixelSum = pixelSum+dat[i];
					rgb_pos ++;
				}else if(rgb_pos==3){
					if(pixelSum>420){
						newLines.push(255);
						newLines.push(255);
						newLines.push(255);
						newLines.push(255);
					}else{
						newLines.push(0);
						newLines.push(0);
						newLines.push(0);
						newLines.push(255);
					}
					pixelSum = 0;
					rgb_pos = 0;
				}

			}

			var pos =0;
			for(var i=0; i<newLines.length;i++){
				newData[pos] = newLines[i];
				pos ++;
			}

			MARKERS.push(newLines);
			list.data = new Uint8ClampedArray(newLines);
			context.putData(list, 200, 200);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = 200;
			canvas.height = 200;
			var idata = ctx.createImageData(200, 200);
			idata.data.set(newData);
			ctx.putImageData(idata, 0, 0);
			image.src = canvas.toDataURL();
			console.log('agregando marcador');
			setTimeout(function(){
				loop = setInterval(initConvolution, frameRate);
			},frameRate);




		}

    function iniciarCamara(){
            //console.log('reiniciando');
            view.innerHTML = "";
            cargarImagen();

            /*navigator.getUserMedia({video:{facingMode:"environment", width: 520, height: 520}},
            function(stream){
                player.srcObject = stream;
                player.play();
                player.onplay = function(){
                    var toast = new Toasty();
                    toast.show("iniciando", 1000);
                    image.style.display = 'none';
                    player.style.display = "block";
                    borrar.style.display = "none";
                    guardar.style.display = "none";
                    captureButton.style.display = "block";
                    view.style.display = 'block';


                }

            },function(err){
                 var toast = new Toasty();
                toast.show(err, 1000);
                console.log(err);
            });*/


        }
    function showVideo(stream){
            player.srcObject = stream;
            player.play();
            player.style.display = "block";
            captureButton.style.display = "block";
            guardar.style.display = "none";
        }
    function getStorageId(){
            var alpha = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            var length = 9;
            var array = alpha.split(",");
            var finalId = "";
            for(var i=0;i<length;i++){
                finalId += array[Math.floor((Math.random() * 64) + 1)];
            }


            return finalId;
        }
    function guardarFoto(){
            snapshotCanvas.toBlob(function(blob){
                subirBlob(blob);
            }, "image/png", 9);
    }
    function subirBlob(blob){
            var refId = getStorageId();
            var storageRef = firebase.storage().ref();
            var metadata = {
                 contentType: 'image/png'
            };


            console.log("Subiendo Foto...");
            var uploadTask = storageRef.child('publicaciones/'+refId+'.png').put(blob, metadata);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED , function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }, function(error){
               console.log(error);
            }, function(){
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        document.getElementById("camera_cont").innerHTML = "";
                        continuarPublicando(downloadURL);
                });
            });




        }
    function setVideoView(){
        	var cont= '';

          cont += '<div><video id="player"></video>';
          cont += '<div id="marco"></div></div>';


          cont += '<h1 id="camera_title">Escanea el marcador</h1>';

          cont += '<canvas id="snapshot"></canvas>';
					cont += '<button id="capture"></button>';
          cont += '<img id="photoImg">';
					cont += '<img id="photoImg2">'
          cont += '<button id="startCamera" ></button>';
          cont += '<button id="changeCamera" ></button>';
          cont += '<img id="resultAR">';
					cont += '<button id="closeCamara"></button>';
					cont += '<button id="pause">II</button>';
					document.getElementById("camera_cont").innerHTML = '';
          document.getElementById("camera_cont").innerHTML = cont;
          document.getElementById("camera_cont").style.display ="block";
					
					
						// player = document.getElementById('player');
						// player.style.display = 'block';
          	// snapshotCanvas = document.getElementById('snapshot');
						// renderCanvas = snapshotCanvas;
          	// captureButton = document.getElementById('capture');
          	// guardar = document.getElementById('changeCamera');
          	// borrar = document.getElementById('startCamera');
          	// cerrar = document.getElementById('closeCamara');
						// pause = document.getElementById('pause');
          	// image = document.getElementById('photoImg');
						// image2 = document.getElementById('photoImg2');
						// title = document.getElementById('camera_title');
          	// cerrar.addEventListener('click', cerrarCamara);
          	// borrar.addEventListener('click', iniciarCamara);
          	// guardar.addEventListener('click', guardarFoto);
          	// captureButton.addEventListener('click',initConvolution);
						// pause.addEventListener('click', pausar);
						var view = document.getElementById("camera_cont");
						console.log('view');
          	return view;
					
          
        }
  }
	
}


export default AR;
