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
    switch ( cmd )
    {
        case "init":

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
                        "summary TEXT "            +
                        ");");
                db.run("CREATE TABLE files ( "      +
                        "id INTEGER PRIMARY KEY, "  +
                        "post_id INTEGER, "         +
                        "name TEXT, "               +
                        "path TEXT "                +
                        ");");
            });
            console.log( "Initialized database for group: " + group );
            break;

        default:
            console.log("*** Error: unknown command.  Use: init or addusers.");
            break;
    }
}


module.exports = {
  dbinit: dbinit
}


