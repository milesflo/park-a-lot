var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	morgan 				= require("morgan"),
	routes 				= require('./routes'),
	path 				= require('path'),
	knex 				= require('../db/knex'),
	passport 			= require('passport'),
    dotenv              = require('dotenv'),
	fbworker			= require('./fbReqs.js'),
	jwt					= require('jsonwebtoken'), 
	token;


require('dotenv').load();


passport.deserializeUser(function(user, done) {
	knex('users').where({ id: user.id }).then(function(user, err) {
		done(err, user);
	});
});

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/templates',express.static(path.join(__dirname, '../client/js/templates')));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(req,res){
	res.sendFile(path.join(__dirname,'../client/views', 'index.html'));
});


require('./routes/users.js')(app,passport);
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {console.log("Listening on localhost:", PORT)});
