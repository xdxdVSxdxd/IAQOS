var app = {
    // Application Constructor
    dd: null,
    timerScene2: null,
    timerScene3: null,
    nrows: 12,
    ncols: 25,
    maxwordweight: 1,
    maxwordnetworkwordsize: 20,
    dx: 1,
    dy: 1,
    choicemade: null,
    initialize: function() {
        $("#QLOGO").click(function(){app.scene2();});
        $("#gotoselfie").click(function(){
            app.choicemade = "selfie";
            if(app.timerScene3!=null){
                clearTimeout(app.timerScene23);
            }
            app.scene4();
        });

        $("#gotomessage").click(function(){
            app.choicemade = "message";
            if(app.timerScene3!=null){
                clearTimeout(app.timerScene23);
            }
            app.scene4();
        });
        $("#gotoaction").click(function(){
            app.scene5();
        });

        $("#gotoback").click(function(){
            app.scene1();
        });
        $("#grazie3").click(function(){
            app.scene1();
        });
        this.scene1();
    },
    scene1: function(){
        $("#intro").css("display","block");
        $("#mind").css("display","none");
        $("#choice").css("display","none");
        $("#legal").css("display","none");
        $("#action").css("display","none");
        $("#thanks").css("display","none");


        TransIntro();
    },
    scene2: function(){
        $("#intro").css("display","none");
        $("#mind").css("display","block");
        $("#choice").css("display","none");
        $("#legal").css("display","none");
        $("#action").css("display","none");
        $("#thanks").css("display","none");

        //-------------------------


        $("#wordnetwork").html("");
        app.dx = Math.floor($("#wordnetwork").width()/this.ncols - 2);
        app.dy = Math.floor($("#wordnetwork").height()/this.nrows - 2);
        for(var j=0; j<this.nrows;  j++){
            for(var i=0; i<this.ncols;  i++){
                d3.select("#wordnetwork").append("div")
                    .attr("id", "box-" + i + "-" + j)
                    .attr("class", "box");
                //$("#box-" + i + "-" + j).width(dx);
                //$("#box-" + i + "-" + j).height(dy);
            }    
        }

        if(app.dd==null){
            d3.json( "http://164.132.225.138/~SLO/HEv3/api/getWordNetwork?researches=126,127&limit=300" ,function(data){
                app.dd = data;
                console.log(app.dd);
                app.dd.nodes.forEach(function(d){
                    if(app.maxwordweight<d.weight){
                        app.maxwordweight = d.weight;
                    }
                });
                app.executeLoop();
            });    
        } else {
            app.executeLoop();
        }
        
        $("#wordnetwork").mouseup(function(){

            if(app.timerScene2!=null){
                clearTimeout(app.timerScene2);
            }

            app.scene3();

        });

        //------------------------


    },
    executeLoop: function(){

        for(var j=0; j<app.nrows;  j++){
            for(var i=0; i<app.ncols;  i++){
                var node1 = app.dd.nodes[  Math.round(  Math.random()*(app.dd.nodes.length-1)  )  ];
                var node2 = app.dd.nodes[  Math.round(  Math.random()*(app.dd.nodes.length-1)  )  ];
                $("#box-" + i + "-" + j).html("");
                var ht = "<span class='wordspan' style='font-size:" + Math.round((5+app.maxwordnetworkwordsize*node1.weight/app.maxwordweight)) + "px;'>[" + node1.id + "]</span>";
                ht = ht + "<span class='wordspan' style='font-size:" + Math.round((5+app.maxwordnetworkwordsize*node2.weight/app.maxwordweight)) + "px;'>[" + node2.id + "]</span>";
                ht = ht + "<div class='barchart' style='width: " +  Math.round(app.dx*node2.weight/app.maxwordweight + 4) + "px' ></div>[" + node2.weight + "]";
                ht = ht + "<div class='barchart2' style='width: " +  Math.round(app.dx*node1.weight/app.maxwordweight + 4) + "px' ></div>[" + node1.weight + "]";
                $("#box-" + i + "-" + j).html(ht);
            }
        }

        $("#wordnetwork").animate(
            {
                opacity: 1
            },500,function(){

                if(app.timerScene2!=null){
                    clearTimeout(app.timerScene2);
                }
                app.timerScene2 = setTimeout( app.executeLoop , 2000);

            });
        
    },
    scene3: function(){
        $("#intro").css("display","none");
        $("#mind").css("display","none");
        $("#choice").css("display","block");
        $("#legal").css("display","none");
        $("#action").css("display","none");
        $("#thanks").css("display","none");
        //-------------------------

        app.choicemade = null;

        cyclebackgrounds();

        
        //-------------------------
    },
    scene4: function(){
        $("#intro").css("display","none");
        $("#mind").css("display","none");
        $("#choice").css("display","none");
        $("#legal").css("display","block");
        $("#action").css("display","none");
        $("#thanks").css("display","none");
        //-------------------------

        


        //-------------------------
    },
    scene5: function(){
        $("#intro").css("display","none");
        $("#mind").css("display","none");
        $("#choice").css("display","none");
        $("#legal").css("display","none");
        $("#action").css("display","block");
        $("#thanks").css("display","none");
        //-------------------------

        if(app.choicemade=="selfie"){
            //handle selfie
            navigator.camera.getPicture(imagecaptureSuccess, imagecaptureError)
            //navigator.device.capture.captureImage(imagecaptureSuccess, imagecaptureError);

        } else if(app.choicemade=="message"){
            //handle audio message
            // start audio capture
            navigator.device.capture.captureAudio(audiocaptureSuccess, audiocaptureError);
        }

        //-------------------------
    },
    scene6: function(){
        $("#intro").css("display","none");
        $("#mind").css("display","none");
        $("#choice").css("display","none");
        $("#legal").css("display","none");
        $("#action").css("display","none");
        $("#thanks").css("display","block");
        //-------------------------

        $("#sceltamostra").text(app.choicemade);
        app.choicemade = null;
        

        //-------------------------
    }
    
};


function cyclebackgrounds(){

    var nu = "https://iaqos.online/iaqos-engine/domains/the-face-of-IAQOS/OUTPUTS/" + ( Math.round( Math.random()*405 +1  ) ) + ".png";
    $("#choiceimages").css('background-image', 'url(' + nu + ')');

    if(app.timerScene3!=null){
        clearTimeout(app.timerScene3);
    }
    app.timerScene3 = setTimeout( cyclebackgrounds , 6000);

}

function TransIntro() {


    /*
    $("#intro").animate(
        {
            background: "#FFFFFF"   
        },3000,function(){
            $("#intro").animate(
                {
                    background: "#000000"   
                },3000,function(){
                    TransIntro();
                }
            );            
        }
    );
    */

    d3.select("#intro")
            .transition()
            .duration(3000)
            .styleTween("background", function() { 
                    return d3.interpolate("#000000", "#FFFFFF"); 
            })
            .on("end",function(){
                d3.select("#intro")
                .transition()
                .duration(3000)
                .styleTween("background", function() { return d3.interpolate("#FFFFFF","#000000"); })
                .on("end",function(){
                    TransIntro();
                });
            });
            
}








            var audiocaptureSuccess = function(mediaFiles) {
                var i, path, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                    // do something interesting with the file
                    var ft = new FileTransfer();



                    var win = function (r) {
                        console.log("Code = " + r.responseCode);
                        console.log("Response = " + r.response);
                        console.log("Sent = " + r.bytesSent);
                        app.scene6();
                    }

                    var fail = function (error) {
                        alert("Si è verificato un errore. Forse non c'è connessione? Prova di nuovo");
                        console.log("upload error source " + error.source);
                        console.log("upload error target " + error.target);
                        app.scene1();
                    }


                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = path.substr(path.lastIndexOf('/') + 1);
                    options.mimeType = "audio/3gpp";
                    ft.upload(path, encodeURI("https://iaqos.online/iaqosmobile/uploadaudio.php"), win, fail, options);
                    //ft.upload(path, encodeURI("http://192.168.1.238/iaqosmobile/uploadaudio.php"), win, fail, options);
                }
            };

            // capture error callback
            var audiocaptureError = function(error) {
                navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
            };


            var imagecaptureSuccess = function(URI) {
                var i, path, len;

                    path = URI;
                    // do something interesting with the file
                    var ft = new FileTransfer();

                    var win = function (r) {
                        console.log("Code = " + r.responseCode);
                        console.log("Response = " + r.response);
                        console.log("Sent = " + r.bytesSent);
                        app.scene6();
                    }

                    var fail = function (error) {
                        alert("Si è verificato un errore. Forse non c'è connessione? Prova di nuovo");
                        console.log("upload error source " + error.source);
                        console.log("upload error target " + error.target);
                        app.scene1();
                    }


                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = path.substr(path.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";

                    ft.upload(path, encodeURI("https://iaqos.online/iaqosmobile/uploadimage.php"), win, fail, options);
                    //ft.upload(path, encodeURI("http://192.168.1.238/iaqosmobile/uploadaudio.php"), win, fail, options);

            };

            // capture error callback
            var imagecaptureError = function(error) {
                navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
            };




