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
var databaseinit = function (cmd, dbname, group, path) 
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
                    "type TEXT, "              +
                    "title TEXT, "             +
                    "summary TEXT, "           +
                    "body TEXT, "              +
                    "filename TEXT "           +
                ");");
            db.run("CREATE TABLE submitters ( "  +
                    "id INTEGER PRIMARY KEY, "   +
                    "name TEXT "                 +
                    ");");});
        console.log( "Initialized database for group: " + group );
		
		//make subdirectory for group
		var grppath = __dirname + '/groups//' + group;
		
		if (!fs.exists(grppath))
		{
			fs.mkdir(grppath, function() {
			});
		}
		
        break;

    case "addusers":
        dbname = process.argv[3] + ".db";
        db = new sqlite3.Database( dbname, sqlite3.OPEN_READWRITE );
        users = process.argv.slice(4);
        db.serialize();
        stmt = db.prepare( "INSERT INTO submitters (name) VALUES (?);" );
        for ( var i = 0; i < users.length; i++ )  {
            stmt.run( users[i] );
        }
        stmt.finalize();
        db.parallelize();
        console.log("Inserted " + users.length + " users.");
        break;

    default:
        console.log("*** Error: unknown command.  Use: init or addusers.");
        break;
	}
	
}

module.exports = {
  databaseinit: databaseinit
}


