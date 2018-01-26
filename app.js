var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
// var users = require('./routes/users');
var shortUrl=require('./model/shorterUrl');

var app = express();

//Set up mongoose connection
var mongoose=require("mongoose");
var dev_db_url="mongodb://cs2252:2252Chns@ds145780.mlab.com:45780/mydatabase";
var mongoDB= dev_db_url;
mongoose.connect(mongoDB,function(err){
	if(err)
	console.log("error connecting to database");
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);
// app.get("/new",function(req,res,next){
// 	res.send("sending something");
// })

app.post("/new",function(req,res){
	
	var urlToShorten=req.body.name;
	// res.send("something");
	var regex=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?//=]*)?/gi;
	if(regex.test(urlToShorten))
	{
		// res.send("works");
		var short=Math.floor(Math.random()*1000000).toString();
		var data= new shortUrl(
			{
				originalUrl:urlToShorten,
				shorterUrl:short
							
			}
		);
		data.save(function(err){
			if(err)
			res.send("Error saving to database");
		});
		res.json(data);

	}
	else
		res.send({originalUrl:"Invalid URL"});
	

});

app.get('/:link(*)',function(req,res,next){
		shortUrl.findOne({shorterUrl: req.params.link},'originalUrl',function(err,result){
			if(err)
				res.send("data not found");
			else
				res.redirect("http://"+result.originalUrl);
			// res.send("sending response");
		});	

		// res.send("this is in lasdt");
});







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send("File not found");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(err)
  res.send("something went wrong");
});

module.exports = app;
