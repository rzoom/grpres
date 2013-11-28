
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

    var post_path = GLOBAL.grppath + '/post_' + num;

    if ( !fs.existsSync(post_path) )
    { fs.mkdir( post_path ); }

    if ( req.body.submitarea )
    { fs.writeFileSync( post_path+'/body.txt', req.body.submitarea ); }

    for ( var k in req.files )
    {
        var f = req.files[k];

        // Save each file if it has a legitimate name.
        if ( f.name )
        {
            var file_path = post_path + '/' + f.name;
            var dl_path = 'post_' + num + '/' + f.name;
            fs.renameSync( f.path, file_path );
            GLOBAL.db.run( "INSERT INTO files (post_id, name, path) VALUES (?,?,?);",
                    num, f.name, dl_path );
        }
        // No name means no file was uploaded, delete the temp.
        else
        { fs.unlinkSync( f.path ); }
    }
};


exports.submit_post = function( req, res ) {

    // TODO: moment
    GLOBAL.db.run(
        "INSERT INTO posts (time, submitter, title, summary) VALUES (?,?,?,?);",
        'Aug 18, 2013', req.body.submitter, req.body.title, req.body.summary );
        //moment(), req.body.submitter, req.body.title, req.body.summary );

    GLOBAL.db.get( "SELECT last_insert_rowid() AS num FROM posts;", function (err, row) {
        save_files_from_req( req, row['num'] ); } );

    res.redirect( '/index' );
};


exports.submission = function( req, res ) {

    var pid = req.params['id'];

    // Grab the post.
    GLOBAL.db.get( 'SELECT * FROM posts WHERE id=?;', pid,
        function(err, post) {
            if ( !post ) {
                // TODO: 404 handler, with contextual message.
            }

            // Grab the associated files.
            GLOBAL.db.all( 'SELECT * FROM files WHERE post_id=?;', pid,
                function(err, files) {
                    // TODO: Display the content of body.txt
                    res.render( 'submission', { title: GLOBAL.group + ': ' + post['title'],
                                                subtitle: post['title'],
                                                summary: post['summary'],
                                                submitter: post['submitter'],
                                                date: post['time'],
                                                files: files,
                                                body: 'PLACEHOLDER' } );
                
                });
        });
};

