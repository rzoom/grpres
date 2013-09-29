
/*
 * GET home page.
 */

// TODO: This should display the top-level list of all submissions.
// * title with link to full page
// * summary
exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};


