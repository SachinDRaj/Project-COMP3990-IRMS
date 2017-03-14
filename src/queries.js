
//posts queries

function updateTag(cat1){
  $("#Cat").html("");
  $("#Cat").append(cat1);
}
function getQuery(cat1){
  var c = document.getElementById("region2");
  var select = c.options[c.selectedIndex].value;
  var q="";
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
                    htmlStr += "<tr id='status'"+al+">";
                    htmlStr += "<td class='hoverTitle' data-toggle='modal' data-target='#myModal'>"+data[i].title+"</td>";
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


//************************************************************************
//report queries

function updateTag1(cat1){
  $("#Cat2").html("");
  $("#Cat2").append(cat1);
}
function getQuery1(cat1){
  var c = document.getElementById("region1");
  var select = c.options[c.selectedIndex].value;
  var q="";
  if (select=="All" && cat1=="All") {
    q="";
  }else if (select=="All"){
    q="?report_type2="+cat1;
  }else if (cat1=="All") {
    q="?county="+select;
  }else {
    q="?report_type2="+cat1+"&county="+select;
  }
  return q;
  // console.log(cat1);
}

function getReportsQ(){
  var cat1 = document.getElementById("Cat2").innerHTML;
  var query=getQuery1(cat1);
	var url = "http://localhost:8080/api/get_reports";
  url+=query;
	$.ajax({
            url:url,
            type:"GET"
            }).done(function(data, textStatus, xhr){
                if(data){
                  $("#reportTable").html("");
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
