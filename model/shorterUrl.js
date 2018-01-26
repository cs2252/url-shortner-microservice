var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var urlSchema=new Schema({
	originalUrl:String,
	shorterUrl:String
},{timestamps:true});

const urlModel=mongoose.model('shortUrl',urlSchema);

module.exports=urlModel;