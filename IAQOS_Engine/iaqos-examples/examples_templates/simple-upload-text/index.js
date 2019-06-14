// NOTE: this only works out of the box: if you change your user, change here as well
var standarduser = "IAQOS";
var standardpwd = "IAQOS";


$( document ).ready(function() {

    $("#name").val( standarduser );
    $("#pwd").val( standardpwd );


    $("#invia").click(function(){

        var name = $("#name").val();
        var pwd = $("#pwd").val();
        var domain = $("#domain").val();
        var label = $("#label").val();
        var content = $("#content").val();
        var type = $("#type").val();


        if(
            name!=null && typeof name !== 'undefined' && name.length!=0 && 
            pwd!=null && typeof pwd !== 'undefined' && pwd.length!=0 && 
            domain!=null && typeof domain !== 'undefined' && domain.length!=0 && 
            content!=null && typeof content !== 'undefined' && content.length!=0 && 
            label!=null && typeof label !== 'undefined' && label.length!=0 && 
            type!=null && typeof type !== 'undefined' && type.length!=0 
        ){

            content = content.replace(/(?:\r\n|\r|\n)/g, '.');
            label = label.replace(/(?:\r\n|\r|\n)/g, '.');

            var q3 = "../../iaqos-engine/"
            var qv = "{\"name\": \"" + name + "\", \"pwd\": \"" + pwd + "\",    \"domain\": \"" + domain + "\", \"function\": \"addcontent\", \"params\" : [  [\"content\"  ,  \"" + content.replace('"'," ") + "\"  ] , [\"type\"  ,  \"" + type + "\"  ]  , [\"label\"  ,  \"" + label.replace('"'," ") + "\"  ]    ]  }";
            $.getJSON(q3,{ q: qv }, function(data){
                console.log(data);
                if(data.result.error){
                    alert(data.result.error);
                } else if(data.result.message){
                    alert(data.result.message);
                }
            });

        } else {

        }


    });

    
 
});