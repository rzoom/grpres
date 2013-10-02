
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

