var fs = require('fs');
var sqlite3 = require('sqlite3');
var moment = require('moment');


var get_post_path = function ( id )
{
    return ( GLOBAL.grppath + '/post_' + id );
};


var get_body_file_path = function ( id )
{
    return ( get_post_path(id) + '/body.txt' );
};


var get_body_file_text = function ( id )
{
    var body_path = get_body_file_path( id );

    if ( fs.existsSync( body_path ) )
    { return ( fs.readFileSync( body_path ) ); }
    else
    { return ( 'Empty' ); }
};


var save_files_from_req = function ( req, id )
{
    var post_path = get_post_path(id);

    if ( !fs.existsSync(post_path) )
    { fs.mkdirSync( post_path ); }

    if ( req.body.submitarea )
    { fs.writeFileSync( post_path+'/body.txt', req.body.submitarea ); }

    for ( var k in req.files )
    {
        var f = req.files[k];

        // Save each file if it has a legitimate name.
        if ( f.name )
        {
            var file_path = post_path + '/' + f.name;
            var dl_path = 'post_' + id + '/' + f.name;
            fs.writeFileSync( file_path, String( fs.readFileSync( f.path ) ) );
            fs.unlinkSync( f.path );
            GLOBAL.db.run( "INSERT INTO files (post_id, name, path) VALUES (?,?,?);",
                    id, f.name, dl_path );
        }
        // No name means no file was uploaded, delete the temp.
        else
        { fs.unlinkSync( f.path ); }
    }
};


exports.submit = function ( req, res )
{
    res.render( 'submit',
            { group: GLOBAL.group,
              body_placeholder: 'Optional',
              action: '/submit' } );
};


exports.submit_post = function ( req, res )
{
    GLOBAL.db.run(
        "INSERT INTO posts (time, submitter, title, summary) VALUES (?,?,?,?);",
        moment().format('MMM DD YYYY'), req.body.submitter, req.body.title, req.body.summary );

    GLOBAL.db.get( "SELECT last_insert_rowid() AS num FROM posts;", function (err, row) {
        save_files_from_req( req, row['num'] ); } );

    res.redirect( '/index' );
};


exports.update_post = function ( req, res )
{
    var pid = req.params['id'];

    GLOBAL.db.run(
        "UPDATE posts SET time=?, submitter=?, title=?, summary=? WHERE id=?;",
        moment().format('MMM DD YYYY'), req.body.submitter, req.body.title,
        req.body.summary, pid );

    save_files_from_req( req, pid );

    res.redirect( '/index' );
};


exports.submission = function ( req, res )
{
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
                    res.render( 'submission', { title: GLOBAL.group + ': ' + post['title'],
                                                pid: pid,
                                                post_title: post['title'],
                                                summary: post['summary'],
                                                submitter: post['submitter'],
                                                date: post['time'],
                                                files: files,
                                                body: get_body_file_text(pid) } );
                });
        });
};


exports.delete = function ( req, res )
{
    // This just deletes the info from the database, the files are still there.

    var pid = req.params['id'];

    GLOBAL.db.run( 'DELETE FROM posts WHERE id=?;', pid );
    GLOBAL.db.run( 'DELETE FROM files WHERE post_id=?;', pid );

    res.redirect( '/index' );
};


exports.edit = function ( req, res )
{
    var pid = req.params['id'];

    GLOBAL.db.get( 'SELECT * FROM posts WHERE id=?;', pid,
            function ( err, post ) {
                // TODO: Allow deleting files associated with this submission,
                // and adding new files.
                res.render( 'submit', { group: GLOBAL.group,
                                        post_title: post['title'],
                                        summary: post['summary'],
                                        submitter: post['submitter'],
                                        body: get_body_file_text(pid),
                                        action: '/submit/'+pid } );
            });
};


