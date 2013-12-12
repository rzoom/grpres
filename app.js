/*
 *  Use:  $ node app.js -g <group>
 *
 * */


// Load Node.js libs.
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var sqlite3 = require('sqlite3');
var database = require('./database');

// handle command line args
var argv = require('optimist')
            .usage('Run the Group Research web app.\nUsage: $0')
            .alias('g', 'group').describe('g', 'set the group to use').demand('g')
            .alias('p', 'pass').describe('p', 'set the group password').demand('p')
            .argv;

GLOBAL.group = argv.g;
GLOBAL.group_password = argv.p;

// Include modules for their handler functions.
var routes = require('./routes/index');   // routes/index.js  (default)
var submit = require('./routes/submit');  // routes/submit.js
var login = require('./routes/login');    // routes/submit.js
var config = require('./config');         // handle initial config

// Create application.
var app = express();

// add config
var devenv = config.devenvironment(app, express);


GLOBAL.grppath = __dirname + '/' + GLOBAL.group;
if ( !fs.existsSync( GLOBAL.grppath ) )
{
    fs.mkdirSync( GLOBAL.grppath );
}

// TODO: Move the database file into the group dir.
var dbname = GLOBAL.group + '.db';
GLOBAL.errormessage = '';

// Connect to database.
if ( !fs.existsSync( dbname ) )
{
    database.dbinit('init', dbname, GLOBAL.group, path);
    console.log( 'no database found, initializing database named \'' + GLOBAL.group + '\'');
}

var sha = crypto.createHash('sha1');
sha.update( GLOBAL.group + GLOBAL.password + Date.now().toString() );
var cookie_secret = sha.digest( 'hex' );

GLOBAL.db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );

// Set node/express variables.
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Set up express middleware.
app.use(express.favicon());
//app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.cookieParser( cookie_secret ));
app.use(express.session());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, GLOBAL.group)));
app.use(express.basicAuth(GLOBAL.group, GLOBAL.group_password));
app.use(app.router);

// Set up routes and handlers.
app.get( '/', function(req, res) { res.redirect('/index') } );
app.get( '/index', routes.index );
app.get( '/submit', submit.submit );
app.get( '/submissions/:id', submit.submission );
app.get( '/delete/:id', submit.delete_post );
app.get( '/edit/:id', submit.edit_post );
app.post( '/submit', submit.submit_post );
app.post( '/submit/:id', submit.update_post );


// Listen on the port / run app.
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


