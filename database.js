//
// Set up the database for the backend of the site for grpres.
//
// If any other set up or initialization is needed, this should handle that as
// well.
//
//
// Options:
// $ node grpres.js init <group>
// $ node grpres.js addusers <group> <user1> <user2> ...
//
var fs = require('fs');
var sqlite3 = require('sqlite3');

//cmd is an array based on command line values, i.e. 
var dbinit = function (cmd, dbname, group, path) 
{
//var group, users, db, dbname, stmt;
  //var newObject = new ActiveXObject("Scripting.FileSystemObject");
  
  switch ( cmd )
    {
    case "init":
        // TODO: init should allow for setting the group password.
        // $ node grpres.js init <group> <password>
        //group = process.argv[3];
        //dbname = group + ".db";

        if ( fs.existsSync( dbname ) )
        {
            console.log( '*** Error:  database already exists for this group:  ' + dbname );
            process.exit( -1 );
        }

        db = new sqlite3.Database( dbname );
        db.serialize( function() {
            db.run("CREATE TABLE posts ( "     +
                    "id INTEGER PRIMARY KEY, " +
                    "time TEXT, "              +
                    "submitter TEXT, "         +
                    "title TEXT, "             +
                    "summary TEXT, "           +
                    "body TEXT "               +
                    ");");
            db.run("CREATE TABLE files ( "      +
                    "id INTEGER PRIMARY KEY, "  +
                    "post_id INTEGER, "         +  // foreign key needed?
                    "name TEXT, "               +
                    "path TEXT "                +
                    ");");
        });
        console.log( "Initialized database for group: " + group );

        //make subdirectory for group
        var grppath = __dirname + '/groups//' + group;
        
        if (!fs.exists(grppath))
        {
            fs.mkdir(grppath, function() {
            });
        }
        
        break;

    default:
        console.log("*** Error: unknown command.  Use: init or addusers.");
        break;
    }
    
}

var maketextfile = function(res, submittedtext, grppath) {
var textname = 'nonsense'; //TODO make this dynamic
var filetype = 'txt';

    if (!fs.exists(grppath + filetype))
    {
        fs.mkdir(grppath + filetype, function() {
        });
    }
    
fs.writeFile(grppath + filetype + '//' + textname + '.' + filetype, submittedtext);
res.redirect('/index');
}

module.exports = {
  dbinit: dbinit,
  maketextfile: maketextfile
}


