// server.js

// BASE SETUP
// =============================================================================
var Report 	   = require('./app/models/report');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017'); // connect to our database

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/reports')

    // create a report (accessed at POST http://localhost:3000/api/reports)
    .post(function(req, res) {
        
        var report = new Report();      // create a new instance of a Report
        report.report_type1 = req.body.report_type1;  // set the report type(general) (comes from the request)
        report.report_type2 = req.body.report_type2;  // set the report type(general) (comes from the request)
		report.description = req.body.description;
		report.votes = req.body.votes;
		report.loc = req.body.loc;
        // save the report and check for errors
        report.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Report created!' });
        });
        
    });
	
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('It works! ' + port);