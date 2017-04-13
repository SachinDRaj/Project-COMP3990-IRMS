var mongoose     = require('mongoose');//Mongoose library
var Schema       = mongoose.Schema;

var ReportSchema   = new Schema({//Schema defines how reports are stored
    report_type1: String,
	report_type2: String,
	title: String,
	date: Date,
	description: String,
	likes: Number,
	dislikes: Number,
	county: String,
	lat: Number,
	lng: Number,
	img: String

});

module.exports = mongoose.model('Report', ReportSchema);//Export model
