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
	

//send the request to app.js route api/add_new_report
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

function getCategory(category){
	if(category == "flooding")
		return "disaster";
	else
	if(category == "road_repair")
		return "public_infrastructure";
	else
	if(category == "garbage_collection")
		return "health_hazard";

}

function addPost(){
	
	var c = document.getElementById("categorySelect");
	var s = document.getElementById("statusSelect");
	var summ = document.getElementById("summary").value;
	var category = c.options[c.selectedIndex].value;
	var curr_status = s.options[s.selectedIndex].value;

	if(category == "Select" || curr_status == "Select")
		alert("Insufficient information");
	else{
		var cat1 = getCategory(category);
		
		var dataToSend = {
			category1: cat1,
			category2: category,
			current_status: curr_status,
			summary: summ,
			likes: 0,
			dislikes: 0
			//loc: [126.4, 10.1]
		};
				
		$.ajax({
			url: "http://localhost:8080/api/add_new_post",
			data : dataToSend,
			type: "POST"
		}).done(function(response){ //this block executes if the request was sent successfully
			console.log("Success! response was "+response);

		}).fail(function(){ //this block executes if the request failed
			console.log("Request failed");
		});
		
	}
}