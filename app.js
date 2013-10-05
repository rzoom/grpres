/*
 *  Use:  $ node app.js <group>
 *
 * */


// Load Node.js libs.
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var sqlite3 = require('sqlite3');
var database = require('./database');

// Include modules for their handler functions.
var routes = require('./routes/index');  // routes/index.js  (default)
var submit = require('./routes/submit');  // routes/submit.js
var config = require('./config'); //handle initial config shit

// Create application.
var app = express();

//add config shit
var devenv = config.devenvironment(app, express);

// Grab group name, set to global variable.
var findgroup = config.parsecmd('groupname');
if (findgroup[0]!=-1)
	{
	GLOBAL.group = findgroup[1];
	}
	else
	{
	Global.group = 'default';
	}
	
console.log( 'group name set to \'' + group + '\'');

var dbname = group + '.db';

// Connect to database.
if ( !fs.existsSync( dbname ) )
{
	database.databaseinit('init', dbname, group, path);
	console.log( 'no database found, initializing database named \'' + group + '\'');
}

var grppath = __dirname + '/groups//' + group + '//';
GLOBAL.db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );

// Set node/express variables.
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Set up express middleware.
app.use(express.favicon());
//app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// TODO: add group level security.

// Set up routes and handlers.
app.get('/', routes.index);
app.get('/submit', submit.submit);  // use exported submit function in submit module.
// TODO:
app.post( '/submit', function(req, res){
var submittedtext = req.body.submitarea;
var textname = 'nonsense'; //TODO make this dynamic

console.log( 'you submitted the value ' + submittedtext);
fs.writeFile(grppath + textname + '.txt', submittedtext);
res.redirect('..');
});

// * app.get( '/submissions', ... );  <-- display full info for the submission listed.

// Listen on the port / run app.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


