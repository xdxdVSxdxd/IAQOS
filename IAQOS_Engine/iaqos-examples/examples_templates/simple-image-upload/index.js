$( document ).ready(function() {
 
    $("#invia").click(function(){


    	if (  $("#name").val()!=""){

    		if (  $("#pwd").val()!=""){

    			// i campi sono valorizzati

    			var name = $("#name").val();
    			var pwd = $("#pwd").val();
    			var domain = $("#domain").val();

    			var request = "{	\"name\": \"" + name + "\", \"pwd\": \"" + pwd + "\",	\"domain\": \"" + domain + "\",  \"function\": \"addfile\", \"params\" : [ ]  }";
    			$("#q").val(request);
    			$("#formA").submit();

	    	} else {
	    		alert("inserire una password!")
	    	}


    	} else {
    		alert("inserire un nome utente!")
    	}


    });
 
});