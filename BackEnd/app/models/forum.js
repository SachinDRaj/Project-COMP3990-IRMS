var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ForumSchema   = new Schema({
    category1: String,
	category2: String,
	current_status: String,
  title: String,
	summary: String,
	date: Date,
	likes: Number,
	dislikes: Number,
  county: String,
  lat: Number,
  lng: Number,
	loc: {
	type: [Number], //[<longitude>, <latitude>]
	index: '2d'		//create the geospatial index
	}

});

module.exports = mongoose.model('ForumPost', ForumSchema);
