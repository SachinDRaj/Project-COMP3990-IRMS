
//posts queries

function properF(cat1){
  if (cat1=="All Categories") {
    return "All";
  }else if (cat1=="Flooding") {
    return "flooding";
  }else if (cat1=="Road Repairs") {
    return "road_repair";
  }else if (cat1=="Garbage Collection") {
    return "garbage_collection";
  }
}

function updateTag(cat1){
  $("#Cat").html("");
  $("#Cat").append(cat1);
  getPostQ2();
}
function getQuery(cat1){
  var c = document.getElementById("region2");
  var select = c.options[c.selectedIndex].value;
  var q="";
  cat1 = properF(cat1);
  if (select=="All" && cat1=="All") {
    q="";
  }else if (select=="All"){
    q="?category2="+cat1;
  }else if (cat1=="All") {
    q="?county="+select;
  }else {
    q="?category2="+cat1+"&county="+select;
  }
  return q;
  // console.log(cat1);
}

function rowAlert1(data) {
  var alert;
  if(data.current_status == 'fixed'){
     alert = 'class="alert alert-success"';
  }
  else if (data.current_status == 'ongoing') {
     alert = 'class="alert alert-warning"';
  }
  return alert;
}
function rowStatus1(data) {
  var status;
  if(data.current_status == 'fixed') {
    status = 'class="glyphicon glyphicon-ok pull-right"';
  }
  else if (data.current_status == 'ongoing') {
    status = 'class="glyphicon glyphicon-cog pull-right"';
  }
  return status;
}

function getPostQ2(){
  var cat1 = document.getElementById("Cat").innerHTML;
  var query=getQuery(cat1);
	var url = "http://localhost:8080/api/get_posts";
  url+=query;
	$.ajax({
            url: url,
            type:"GET"
            }).done(function(data, textStatus, xhr){
                if(data){
                  $("#posttable").html("");
                  var htmlStr="";
                  for (var i = 0; i < data.length; i++) {
                    console.log(data[i].title);
                    var al = rowAlert1(data[i]);
                    var stat = rowStatus1(data[i]);

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

function modalQ(id){
  var query="?_id="+id;
	var url = "http://localhost:8080/api/get_posts";
  url+=query;
	$.ajax({
            url: url,
            type:"GET"
            }).done(function(data, textStatus, xhr){
                if(data){
                  $("#mTitle").html("Title: ");
                  $("#mTitle").append(data[0].title);
                  $("#mCat").html("");
                  $("#mCat").append(data[0].category2);
                  $("#mStatus").html("");
                  $("#mStatus").append(data[0].current_status);
                  $("#mSum").html("");
                  $("#mSum").append(data[0].summary);
                  $("#mDate").html("");
                  $("#mDate").append(data[0].date);
                  $("#mLoc").html("");
                  $("#mLoc").append("<b>Address: </b>Lat:"+data[0].lat+" Lng:"+data[0].lng);
                  $("#mCounty").html("<b>County: </b>");
                  $("#mCounty").append(data[0].county);
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
