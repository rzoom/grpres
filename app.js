/*
 *  Use:  $ node app.js <group>
 *
 * */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var sqlite3 = require('sqlite3');

var group = process.argv[2];
var dbname = group + '.db';

if ( !fs.existsSync( dbname ) )
{
    console.log( '*** Error:  no database file for this group:  ' + dbname );
    process.exit( -1 );
}

var db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



