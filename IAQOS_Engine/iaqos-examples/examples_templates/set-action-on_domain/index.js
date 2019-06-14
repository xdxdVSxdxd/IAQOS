var mindimension = 4;
var maxdimension = 50;
var imagesize = 204;

// NOTE: this only works out of the box: if you change your user, change here as well
var standarduser = "IAQOS";
var standardpwd = "IAQOS";

function calculateImageSize(dim){
    imagesize = 28 + (dim-4)*4;
    // console.log(imagesize);
    $("#dimension").text(  imagesize + "x" + imagesize + " pixels"  );
}

function check_input(){
    var fsize = $("#filtersize").val();
    if(fsize.trim()==""){
        //$("#filtersize").val(4);
        alert("please insert an integer value between" + mindimension + " and " + maxdimension);
        return false;
    } else if(  !isNormalInteger(fsize) ){
        alert("Inserre solo numeri interi positivi per la dimensione del filtro.")
        return false;
    } else {
        fsize = parseInt(fsize);
        if(fsize<4){
            fsize = 4;
        } else if(fsize>maxdimension){
            fsize = maxdimension;
        }
        $("#filtersize").val(fsize);
        calculateImageSize(fsize);
        if(fsize<mindimension || fsize>maxdimension){
            alert("please insert an integer value between" + mindimension + " and " + maxdimension);
            return false;
        } else {
            return true;    
        }
    }

}


function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}


$( document ).ready(function() {

    $("#name").val( standarduser );
    $("#pwd").val( standardpwd );


    var q1 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"\", \"function\": \"getdomainlist\", \"params\" : [    ]  }";
    $.getJSON(q1,function(data){
        console.log(data);
        if(data.result && data.result.domains){
            for (var i = data.result.domains.length - 1; i >= 0; i--) {
                if( !data.result.domains[i].includes("html") ){
                    $("#domain").append("<option name='" + data.result.domains[i] + "' value='" + data.result.domains[i] + "'>" + data.result.domains[i] + "</option>");    
                }                
            }
        }

    });



    var q2 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"\", \"function\": \"getactionlist\", \"params\" : [    ]  }";
    $.getJSON(q2,function(data){
        console.log(data);
        if(data.result && data.result.actions){
            for (var i = data.result.actions.length - 1; i >= 0; i--) {
                if( !data.result.actions[i].includes("html") ){
                    $("#action").append("<option name='" + data.result.actions[i] + "' value='" + data.result.actions[i] + "'>" + data.result.actions[i] + "</option>");
                }
                
            }
        }

    });


    var q3 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"\", \"function\": \"getdomainswithactionslist\", \"params\" : [    ]  }";
    $.getJSON(q3,function(data){
        console.log(data);
        if(data.result && data.result.actions_in_domains){
            for (var i = data.result.actions_in_domains.length - 1; i >= 0; i--) {
                if( !data.result.actions_in_domains[i].domain.includes("html") ){
                    $("#domain2").append("<option name='" + data.result.actions_in_domains[i].domain + "' value='" + data.result.actions_in_domains[i].domain + "'>" + data.result.actions_in_domains[i].domain + "-" + data.result.actions_in_domains[i].action + "[" + data.result.actions_in_domains[i].param1 + "," + data.result.actions_in_domains[i].param2 + "]" + "</option>");                
                }
            }
        }

    });

    $("#filtersize").val(48);
    calculateImageSize(48);


    $('#filtersize').change(check_input);
 
    $("#invia").click(function(){

        if(check_input()){
            // mandare
            var q3 = "";
            if( $("#action").val() == "gan_image" ){
                q3 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"" + $("#domain").val() + "\", \"function\": \"setactionindomain\", \"params\" : [  [\"action\"  ,  \"" + $("#action").val() + "\"  ] , [\"param1\"  ,  \"" + $("#filtersize").val() + "\"  ] , [\"param2\"  ,  \"" + imagesize + "\"  ]    ]  }";
            } else {
                q3 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"" + $("#domain").val() + "\", \"function\": \"setactionindomain\", \"params\" : [  [\"action\"  ,  \"" + $("#action").val() + "\"  ] , [\"param1\"  ,  \"" + $("#param1").val() + "\"  ] , [\"param2\"  ,  \"" + $("#param2").val() + "\"  ]    ]  }";
            }
            
            $.getJSON(q3,function(data){
                console.log(data);
                if(data.result.error){
                    alert(data.result.error);
                } else if(data.result.message){
                    alert(data.result.message);
                }
            });

        }

    });

    $("#invia2").click(function(){

            var deac = $("#domain2").val();
            if(confirm("Disattivare l'azione su:" + deac + "?")){
                // mandare
                var q3 = "../../iaqos-engine/?q={    \"name\": \"" + $("#name").val() + "\", \"pwd\": \"" + $("#pwd").val() + "\",    \"domain\": \"" + deac + "\", \"function\": \"deactivateactionindomain\", \"params\" : [     ]  }";
                $.getJSON(q3,function(data){
                    console.log(data);
                    if(data.result.error){
                        alert(data.result.error);
                    } else if(data.result.message){
                        alert(data.result.message);
                    }
                });
            }
    });
 
});