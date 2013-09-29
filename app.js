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

// Include modules for their handler functions.
var routes = require('./routes');  // routes/index.js  (default)
var submit = require('./routes/submit');  // routes/submit.js

// Grab group name, set to global variable.
global.group = process.argv[2];
var dbname = group + '.db';

// Connect to database.
if ( !fs.existsSync( dbname ) )
{
    console.log( '*** Error:  no database file for this group:  ' + dbname );
    process.exit( -1 );
}

var db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );

// Create application.
var app = express();

// Set node/express variables.
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Set up express middleware.
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// TODO: add group level security.

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Set up routes and handlers.
app.get('/', routes.index);
app.get('/submit', submit.submit);  // use exported submit function in submit module.
// TODO:
// * app.post( '/submit', ... );  <-- put into the database, redirect to '/'
// * app.get( '/submissions', ... );  <-- display full info for the submission listed.

// Listen on the port / run app.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


