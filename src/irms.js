
function validateForm1() {
    var c = document.getElementById("Select");
		var select = c.options[c.selectedIndex].value;

		var title = document.getElementById("title").value;
		var desc = document.getElementById("description").value;

    if (title == "") {
        alert("title must be filled out");
        return false;
    }
		if (title == "") {
        alert("title must be filled out");
        return false;
    }

		if (typeof(Storage) !== "undefined") {
	    localStorage.setItem("select", select);
			localStorage.setItem("title", title);
			localStorage.setItem("desc",desc);
		}
		else {
		    alert("Sorry, your browser does not support Web Storage...");
		}
}



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
