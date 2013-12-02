
/*
 * GET home page.
 */


exports.index = function(req, res) {
    
    GLOBAL.db.all( 'SELECT id, title, summary, submitter, time FROM posts ORDER BY id DESC;',
            function(err, posts) {
                res.render('index', { title: 'Main Index',
                                    submissions: posts });
            } );
};


