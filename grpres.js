//
// Set up the database for the backend of the site for grpres.
//
// If any other set up or initialization is needed, this should handle that as
// well.
//
//
// Options:
// node grpres.js init <group>
// node grpres.js addusers <group> <user1> <user2> ...
//


var sqlite3 = require("sqlite3");

var cmd = process.argv[2];

var group, users, db, dbname, stmt;

switch ( cmd )
{
    case "init":
        group = process.argv[3];
        dbname = group + ".db";
        db = new sqlite3.Database( dbname );
        db.run("CREATE TABLE posts ( "     +
                "id INTEGER PRIMARY KEY, " +
                "time TEXT, "              +
                "submitter TEXT, "         +
                "type TEXT, "              +
                "title TEXT, "             +
                "summary TEXT, "           +
                "body TEXT, "              +
                "filename TEXT "           +
            ");");
        db.run("CREATE TABLE submitters ( "  +
                "id INTEGER PRIMARY KEY, "   +
                "name TEXT "                 +
                ");");
        // TODO: handle the case where the database and table already exist.
        console.log( "Initialized database for group: " + group );
        break;

    case "addusers":
        dbname = process.argv[3] + ".db";
        db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );
        users = process.argv.slice(4);
        stmt = db.prepare( "INSERT INTO submitters (name) VALUES (?);" );
        for ( var i = 0; i < users.length; i++ )  {
            stmt.run( users[i] );
        }
        stmt.finalize();
        console.log("Inserted " + users.length + " users.");
        break;

    default:
        console.log("*** Error: unknown command.  Use: init or addusers.");
        break;
}

