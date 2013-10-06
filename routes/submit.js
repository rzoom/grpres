
/*
 * GET submit page
 * */

// TODO: This should be an input form that lets users populate:
// * title
// * summary
// * submitter
// * body or filename(s) (multiple files)
exports.submit = function(req, res) {
    res.render( 'submit',
            {title: 'Submit to '+GLOBAL.group+' Research',
             group: GLOBAL.group} );
};


exports.submission = function(req, res) {
    console.log( req.params['id'] );
    GLOBAL.db.get( 'SELECT * FROM posts WHERE id=?;', req.params['id'],
            function(err, row) {
                if ( !row ) {
                    // TODO: 404 handler, with contextual message.
                }
                res.render( 'submission', { title: GLOBAL.group + ' ' + row.title,
                                            summary: row.summary,
                                            body: row.body}
                    );
            } );
};

