
function clearLS(){
  var select = localStorage.getItem("select");
  var title = localStorage.getItem("title");
  var desc = localStorage.getItem("desc");
  if (title !== ""){
    localStorage.removeItem("title");
  }
  if (desc !== ""){
    localStorage.removeItem("desc");
  }
  if (select !== ""){
    localStorage.removeItem("select");
  }
}

function validateForm1() {
    var c = document.getElementById("Select");
		var select = c.options[c.selectedIndex].value;

		var title = document.getElementById("title").value;
		var desc = document.getElementById("description").value;

    // if (title === "") {
    //     alert("title must be filled out");
    //     return false;
    // }
		// if (desc === "") {
    //     alert("desc must be filled out");
    //     return false;
    // }

		if (typeof(Storage) !== "undefined") {
	    localStorage.setItem("select", select);
			localStorage.setItem("title", title);
			localStorage.setItem("desc",desc);
		}
		else {
		    alert("Sorry, your browser does not support Web Storage...");
		}
}

function getCategory(category){
	if(category == "flooding" || category == "Flooding")
		return "disaster";
	else
	if(category == "road_repair" || category == "Road Repairs")
		return "public_infrastructure";
	else
	if(category == "garbage_collection" || category == "Garbage Collection")
		return "health_hazard";

}

function getCategoryMain(category){//returns category format that is stored in database
	if(category == "Flooding")
		return "flooding";
	else
	if(category == "Road Repairs")
		return "road_repair";
	else
	if(category == "Garbage Collection")
		return "garbage_collection";

}
function addReport(){

	var r2 = getCategoryMain(document.getElementById("ca").innerHTML);//gets innerHTML element and plugs it into function.
	var r1 = getCategory(r2);
	var t = document.getElementById("tt").innerHTML;
	var d = document.getElementById("de").innerHTML;
	
	//Debugging checks in console window
	console.log(r1);
	console.log(r2);
	console.log(t);
	console.log(d);


	var dataToSend = {
		report_type1: r1,
		report_type2: r2,
		title: t,
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
