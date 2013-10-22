
/*
 * GET home page.
 */

// TODO: This should display the top-level list of all submissions.
// * title with link to full page
// * summary

var login = function(req, res) {
				if (req.cookies.username)
				{
				    GLOBAL.user = req.cookies.username;
				}
                res.render('login',
                        { title: 'login screen',
                          error: GLOBAL.errormessage,
                          user: GLOBAL.user }
                    );
}

module.exports = {
  login: login
}
