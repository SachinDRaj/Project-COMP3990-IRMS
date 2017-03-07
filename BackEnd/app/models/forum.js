var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ForumSchema   = new Schema({
    category1: String,
	category2: String,
	current_status: String,
	summary: String,
	date: String,
	likes: Number,
	dislikes: Number,
	loc: {
	type: [Number], //[<longitude>, <latitude>]
	index: '2d'		//create the geospatial index
	}
	
});

module.exports = mongoose.model('ForumPost', ForumSchema);
