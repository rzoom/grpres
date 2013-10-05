
/*
 * GET home page.
 */

// TODO: This should display the top-level list of all submissions.
// * title with link to full page
// * summary

exports.index = function(req, res) {
    
    GLOBAL.db.all( 'SELECT id, title, summary, submitter FROM posts ORDER BY time DESC;',
            function(err, rows) {
                res.render('index', { title: GLOBAL.group+'  research',
                                    submission_count: rows.length,
                                    submissions: rows });
            } );
};


