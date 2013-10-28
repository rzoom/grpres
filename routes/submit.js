
/*
 * GET submit page
 * */

// TODO: This should be an input form that lets users populate:
// * title
// * summary
// * submitter
// * body or filename(s) (multiple files)
exports.submit = function ( req, res ) {
    res.render( 'submit',
            {title: 'submit to '+GLOBAL.group+' research',
             group: GLOBAL.group} );
};


exports.submit_post = function ( req, res ) {
//    GLOBAL.db.run( 'INSERT INTO posts (time, submitter, title, summary) VALUES ' +
//            '()')
};


exports.submission = function(req, res) {
    GLOBAL.db.get( 'SELECT * FROM posts WHERE id=?;', req.params['id'],
            function(err, row) {
                if ( !row ) {
                    // TODO: 404 handler, with contextual message.
                }
                //console.log(row);
                res.render( 'submission', { title: GLOBAL.group + ': ' + row['title'],
                                            subtitle: row['title'],
                                            summary: row['summary'],
                                            body: row['body'] }
                    );
            } );
};

