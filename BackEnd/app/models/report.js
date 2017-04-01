var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReportSchema   = new Schema({
    report_type1: String,
	report_type2: String,
	title: String,
	date: Date,
	description: String,
	votes: Number,
  county: String,
  lat: Number,
  lng: Number,

});

module.exports = mongoose.model('Report', ReportSchema);
