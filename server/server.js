var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	morgan 		= require("morgan"),
	routes 		= require('./routes'),
	path 		= require('path'),
	knex 		= require('../db/knex'),
    dotenv      = require('dotenv'),
	jwt			= require('jsonwebtoken'), 
	request     = require("request"),
	token;


require('dotenv').load();

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/templates',express.static(path.join(__dirname, '../client/views/templates')));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(req,res){
	res.sendFile(path.join(__dirname,'../client/views', 'index.html'));
});

app.get('/apiGet', function(req,res) {
	console.log(req.query);
	request({
		url: "http://api.parkwhiz.com/search/?destination=" + req.query.q + "&distance=" + req.query.dist + "&key="+process.env.keyParkWiz,
		json: true
		}, function(error, response, body) {
			if (body) {
				res.json(body);
			}
		});


		knex('queue').insert({
			query: req.query.q,
			distance: req.query.dist,
			done: false
		}).then(function () {});
});

app.use(function(req, res, next){
  res.status(404);
  res.redirect('/#/')
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {console.log("Listening on localhost:", PORT)});
