var mongoose     = require('mongoose');//Mongoose library
var Schema       = mongoose.Schema;

var ForumSchema   = new Schema({//Schema defines how posts are stored
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
	lng: Number

});

module.exports = mongoose.model('ForumPost', ForumSchema);//Export model
