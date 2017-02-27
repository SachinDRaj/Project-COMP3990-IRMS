function addReport(){
	
	var r1 = "infrastructure";
	var r2 = "road";
	var d = "pot holes";
	var v = 0;
	
	var dataToSend = {
		report_type1: r1,
		report_type2: r2,
		description: d,
		votes: 0,
		//loc: [126.4, 10.1]
	};
	

	$.ajax({
		url: "http://localhost:8080/api/add_new_report",
		data : dataToSend,
		type: "POST"
	}).done(function(response){ //this block executes if the request was sent successfully
    console.log("Success! response was "+response);

	}).fail(function(){ //this block executes if the request failed
    console.log("Request failed");
	});
	
}
