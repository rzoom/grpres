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
            .argv;

GLOBAL.group = argv.g;
GLOBAL.group_password = 'password';

// Include modules for their handler functions.
var routes = require('./routes/index');  // routes/index.js  (default)
var submit = require('./routes/submit');  // routes/submit.js
var login = require('./routes/login');  // routes/submit.js
var config = require('./config'); //handle initial config shit

// Create application.
var app = express();

//add config shit
var devenv = config.devenvironment(app, express);


var dbname = GLOBAL.group + '.db';
GLOBAL.user = 'default';
GLOBAL.errormessage = '';

// Connect to database.
if ( !fs.existsSync( dbname ) )
{
    database.dbinit('init', dbname, GLOBAL.group, path);
    console.log( 'no database found, initializing database named \'' + GLOBAL.group + '\'');
}

var sha = crypto.createHash('sha1');
sha.update( GLOBAL.group + 'uzZqMLS2jLk4RRAZlPfE' + Date.now().toString() );
var cookie_secret = sha.digest( 'hex' );

var grppath = __dirname + '/groups//' + GLOBAL.group + '//';
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
app.use(config.group_session_auth);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// TODO: add group level security.

// Set up routes and handlers.
//handle login
app.get('/', login.login);
app.get('/index', routes.index);
app.get('/submit', submit.submit);  // use exported submit function in submit module.
app.get( '/submissions/:id', submit.submission );  // display full info for the submission listed.

//handle posts
app.post( '/submit', function(req, res)
{
    //if they clicked submit, save to database
    var submittedtext = req.body.submitarea;
    database.maketextfile(res, submittedtext, grppath);
});

app.post( '/', config.verify_login );

// Listen on the port / run app.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


