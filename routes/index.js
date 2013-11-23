
/*
 * GET home page.
 */

// TODO: Fill in header and footer in layout.jade

exports.index = function(req, res) {
    
    GLOBAL.db.all( 'SELECT id, title, summary, submitter FROM posts ORDER BY id DESC;',
            function(err, rows) {
                res.render('index', { title: GLOBAL.group+'  research',
                                    submission_count: rows.length,
                                    submissions: rows });
            } );
};


