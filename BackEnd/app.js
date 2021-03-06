// server.js

// BASE SETUP
// =============================================================================
var Report 	   = require('./app/models/report');
var ForumPost  = require('./app/models/forum');
var User 	   = require('./app/models/user');
var mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017'); // connect to our database

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
router.use(function(req, res, next) {// allow cross domain requests
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
// middleware to use for all requests
router.use('/', function(req, res, next) {
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our api!' });
});

// more routes for our API will happen here

router.route('/add_new_report')

    // create a report (accessed at POST http://localhost:8080/api/reports)
    .post(function(req, res) {

        var report = new Report();      // create a new instance of a Report
        report.report_type1 = req.body.report_type1;  // set the report type(general) (comes from the request)
        report.report_type2 = req.body.report_type2;  // set the report type(general) (comes from the request)
		report.title = req.body.title;
		report.date = req.body.date;
		report.description = req.body.description;
		report.likes = 0;
		report.dislikes = 0;
		report.county = req.body.county;
		report.lat = req.body.lat;
		report.lng = req.body.lng;
		report.img = req.body.img;



        // save the report and check for errors
        report.save(function(err) {//save to database
            if (err)
                res.send(err);

            res.json({ message: 'Report created!' });
        });

    });


router.route('/get_reports')//route for getting reports based on query

	.get(function(req, res) {
        Report.find(req.query, function(err, reports) {//find based on query
            if (err)
                res.send(err);

            res.json(reports);
        });
    });

function getQ(req){//Date must always be submitted in range
	var query = {
		date: {
			$gte: req.start,//start date. $gte == greater than in mongo
			$lte: req.end//end date. $lte == less than in mongo
		}
	};
	if(req.report_type1)//if there is a report type 1 in query url
		query.report_type1 = req.report_type1;
	if(req.report_type2)//if there is a report type 2 in query url
		query.report_type2 = req.report_type2;
	if(req.county)//if county in url
		query.county = req.county;
	return query;
}

router.route('/get_reports_graph')//route for getting graph information

	.get(function(req, res) {

		var q = getQ(req.query);//builds query

        Report.find(q, function(err, reports) {//find based on query
            if (err)
                res.send(err);

            res.json(reports);
        });
    });

router.route('/update_report/:id')//route for updating reports likes(valid) and dislikes(invalid)

	.put(function(req, res) {
		Report.findById(req.params.id, function(err, reports) {//Get id of updated report
			if(err)
				res.send(err);
			
			reports.likes = req.body.likes;
			reports.dislikes = req.body.dislikes;

			reports.save(function(err){//save updated report
				if(err)
					res.send(err);

				res.json({message: 'Updated'});
			});
		});
	});


router.route('/get_reports/:report_id')//Route use to get a specific report id

    .get(function(req, res) {
        Report.findById(req.params.report_id, function(err, reports) {
            if (err)
                res.send(err);
            res.json(reports);
        });
    });



router.route('/delete_reports/:report_id')//Route used to delete single reports based on id

	.delete(function(req, res) {
        Report.remove({
            _id: req.params.report_id
        }, function(err, reports) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });



router.route('/add_new_post')//Route for adding new post

	.post(function(req, res) {

        var post = new ForumPost();
        post.category1 = req.body.category1;
        post.category2 = req.body.category2;
		post.current_status = req.body.current_status;
		post.title = req.body.title;
		post.summary = req.body.summary;
		post.date = req.body.date;
		post.likes = req.body.likes;
		post.dislikes = req.body.dislikes;
		post.county = req.body.county;
		post.lat = req.body.lat;
		post.lng = req.body.lng;

        post.save(function(err) {//save to database
            if (err)
                res.send(err);

            res.json({ message: 'Post created!' });
        });

    });

router.route('/get_posts')//Route for getting forum posts based on query

	.get(function(req, res) {
        ForumPost.find(req.query, function(err, post) {
            if (err)
                res.send(err);

            res.json(post);
        });
    });


//LOG IN TEST -----------------------------------------------//Uncomment to add new user with user: admin, password: admin
// var testUser = new User({//User schema found in app/models folder
//     username: 'admin',
//     password: 'admin'
// });
//
// // save user to database
//
// testUser.save(function(err) {
//     if (err) throw err;
//
// });//end of comments

router.route('/login')//Route for authenticating username

	.post(function(req, res) {
		var user_name = req.body.username;
		var pass = req.body.password;
		User.findOne({ username: user_name }, function(err, user) {//find username
			if (err) res.send(err);
			if(user){
				user.comparePassword(pass , function(err, isMatch) {//user schema function to compare passwords
					if (err) res.send(err);
					var data = {
						id: user.id,
						username: user.username,
						authentication: 0
					};
					if(isMatch){//if an existing user
						data.authentication = 1;
						res.json(data);
					}else{//if not
						data.id = null;
						res.json(data);
					}
				});
			}
			else{
				res.send("No user found");
			}
		});
	});

//-----------------------------------------------------------
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Server API Started\nPort: ' + port);
