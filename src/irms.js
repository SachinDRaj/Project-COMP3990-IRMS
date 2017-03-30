
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

function validateForm2() {
    var c = document.getElementById("select2");
		var region = c.options[c.selectedIndex].value;

		if (typeof(Storage) !== "undefined") {
	    localStorage.setItem("region", region);
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

function getBase64Image(imgElem) {//Converting image to base64
// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    var canvas = document.createElement("canvas");
    canvas.width = imgElem.clientWidth;
    canvas.height = imgElem.clientHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElem, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function addReport(){

	var r2 = getCategoryMain(document.getElementById("ca").innerHTML);//gets innerHTML element and plugs it into function.
	var r1 = getCategory(r2);
	var t = document.getElementById("tt").innerHTML;
	var d = document.getElementById("de").innerHTML;
	var reg = localStorage.getItem("region");
  var lat = localStorage.getItem("lat");
  var lng = localStorage.getItem("lng");
	var date = new Date();
	// console.log(date);
	var jdate = JSON.stringify(date);
	// console.log(jdate);


	//Debugging checks in console window
	console.log(r1);
	console.log(r2);
	console.log(t);
	console.log(d);


	var dataToSend = {
		report_type1: r1,
		report_type2: r2,
		title: t,
		date: jdate,
		description: d,
		votes: 0,
    county: reg,
    lat: lat,
    lng: lng,
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

function getReports(){
	$.ajax({
            url:"http://localhost:8080/api/get_reports",
            type:"GET"
            }).done(function(data, textStatus, xhr){
                if(data){
                  var htmlStr="";
                  for (var i = 0; i < data.length; i++) {
                    htmlStr += "<tr><td class='hoverTitle'>"+data[i].title+"</td><td class='rtable'><a class='btn btn-primary' href='#'> <span class='glyphicon glyphicon-thumbs-up'></span></a> <span class='badge'>5</span> <a class='btn btn-danger' href='#'> <span class='glyphicon glyphicon-thumbs-down'></span></a> <span class='badge'>1</span></td></tr>";
                  }
                  // console.log(htmlStr);
                  $("#reportTable").append(htmlStr);

                }
                else{
                    //if(callback) callback(null);
                }

            }).fail(function(xhr){
                var status = xhr.status;
                var message = null;
                if(xhr.responseText){
                    var obj = JSON.parse(xhr.responseText);
                    message = obj.message;
                }

                if(callback) callback(null);
                console.log(xhr);
            });
}
//Get reports data to be used in map
function getReportsData(){
	$.ajax({
    url:"http://localhost:8080/api/get_reports",
    type:"GET"
    }).done(function(data, textStatus, xhr){
      if(data){
        var rdata = [];
        for(var i = 0; i < data.length; i++){
          var d = {
            id: data[i].id,
            coords:{
              latitude: data[i].latitude,
              longitude: data[i].longitude
            }
          };
          rdata.push(d);
        }
        console.log(rdata);
        return rdata;
      }
      else{
          //if(callback) callback(null);
      }
    }).fail(function(xhr){
      var status = xhr.status;
      var message = null;
      if(xhr.responseText){
          var obj = JSON.parse(xhr.responseText);
          message = obj.message;
      }
      if(callback) callback(null);
      console.log(xhr);
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
//Get Post
//Row builder
function rowAlert(data) {
  var alert;
  if(data.current_status == 'fixed'){
     alert = 'class="alert alert-success"';
  }
  else if (data.current_status == 'ongoing') {
     alert = 'class="alert alert-warning"';
  }
  return alert;
}
function rowStatus(data) {
  var status;
  if(data.current_status == 'fixed') {
    status = 'class="glyphicon glyphicon-ok pull-right"';
  }
  else if (data.current_status == 'ongoing') {
    status = 'class="glyphicon glyphicon-cog pull-right"';
  }
  return status;
}
function getPost(){
	$.ajax({
            url:"http://localhost:8080/api/get_posts",
            type:"GET"
            }).done(function(data, textStatus, xhr){
                if(data){
                  var htmlStr="";
                  for (var i = 0; i < data.length; i++) {
                    console.log(data[i].title);
                    var al = rowAlert(data[i]);
                    var stat = rowStatus(data[i]);
                    var func1=  "onclick='modalQ(\""+data[i]._id+"\");'";
                    htmlStr += "<tr id='status'"+al+">";
                    htmlStr += "<td class='hoverTitle' data-toggle='modal' data-target='#myModal' "+func1+">"+data[i].title+"</td>";
                    htmlStr += "<td class='wtable' id='status1'>"+data[i].current_status+"<span id='status2'"+ stat+"</td>";
                    htmlStr += "<td class='wtable'>"+data[i].date+"</td></tr>";
                  }
                  $("#posttable").append(htmlStr);
                }
                else{
                    //if(callback) callback(null);
                }

            }).fail(function(xhr){
                var status = xhr.status;
                var message = null;
                if(xhr.responseText){
                    var obj = JSON.parse(xhr.responseText);
                    message = obj.message;
                }

                if(callback) callback(null);
                console.log(xhr);
            });
}

function addPost(){

	var c = document.getElementById("category");
	var s = document.getElementById("status");
  var ti = document.getElementById("title").value;
	var summ = document.getElementById("summary").value;
  var ct = document.getElementById("county");
  var county = ct.options[ct.selectedIndex].value;
	var category = c.options[c.selectedIndex].value;
	var curr_status = s.options[s.selectedIndex].value;
  console.log(localStorage.getItem("latLng"));
  console.log(county);
  var coords = localStorage.getItem("latLng");
	if(category == "Select" || curr_status == "Select")
		alert("Insufficient information");
	else{
		var cat1 = getCategory(category);
		var date = new Date();
		console.log(date);
		var jdate = JSON.stringify(date);
		console.log(jdate);
		var dataToSend = {
			category1: cat1,
			category2: category,
			current_status: curr_status,
      title: ti,
			summary: summ,
			date: jdate,
			likes: 0,
			dislikes: 0,
      county:county,
      lat: coords.latitude,
      lng: coords.longitude,
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
