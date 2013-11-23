
/*
 * GET submit page
 * */

var fs = require('fs');
var sqlite3 = require('sqlite3');
var moment = require('moment');


exports.submit = function ( req, res ) {
    res.render( 'submit',
            {title: 'submit to '+GLOBAL.group+' research',
             group: GLOBAL.group} );
};


var save_files_from_req = function( req, num ) {

    var post_path = grppath + '/post_' + num;

    if ( !fs.existsSync(post_path) )
    { fs.mkdir( post_path ); }

    if ( req.body.submitarea )
    { fs.writeFileSync( post_path+'/body.txt', req.body.submitarea ); }

    for ( var k in req.files )
    {
        var f = req.files[k];

        if ( f.name )
        {
            console.log( f );

            var file_path = post_path + '/' + f.name;
            fs.renameSync( f.path, file_path );
            GLOBAL.db.run( "INSERT INTO files (post_id, name, path) VALUES (?,?,?);",
                    num, f.name, file_path );
        }
        else
        { fs.unlinkSync( f.path ); }
    }
};


exports.submit_post = function( req, res ) {

    console.log( req.body.file1 );
    console.log( req.body.file2 );
    console.log( req.body.file3 );

    // TODO: time that is inserted should sort reasonably.
    GLOBAL.db.run(
        "INSERT INTO posts (time, submitter, title, summary) VALUES (?,?,?,?);",
        //'Aug 18, 2013', req.body.submitter, req.body.title, req.body.summary );
        moment(), req.body.submitter, req.body.title, req.body.summary );

    GLOBAL.db.get( "SELECT last_insert_rowid() AS num FROM posts;", function (err, row) {
        save_files_from_req( req, row['num'] ); } );

    res.redirect( '/index' );
};


exports.submission = function( req, res ) {

    var pid = req.params['id'];

    // Grab the post.
    GLOBAL.db.get( 'SELECT * FROM posts WHERE id=?;', pid,
        function(err, row) {
            if ( !row ) {
                // TODO: 404 handler, with contextual message.
            }

            // Grab the associated files.
            GLOBAL.db.all( 'SELECT * FROM files WHERE post_id=?;', pid,
                function(err, rows) {
                    // TODO:
                    // 1. Put the content of body.txt on the page.
                    // 2. Put the list of files with download links on the page.
                    // 3. Handle case where no files.
                    res.render( 'submission', { title: GLOBAL.group + ': ' + row['title'],
                                                subtitle: row['title'],
                                                summary: row['summary'],
                                                submitter: row['submitter'],
                                                date: row['time'],
                                                body: 'PLACEHOLDER' } );
                
                });
        });
};

