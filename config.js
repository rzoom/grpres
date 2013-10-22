//file for handling initialization shit
//load the app using NODE_ENV=<production or development> node app.js in linux; set NODE_ENV in the console, then execute node app.js in windows
var devenvironment = function ( app, express ) 
{
    switch(process.env.NODE_ENV)
    {
        case 'production':
            console.log('dev setting set to production');
            //passwords, etc.
            return 'production';
            
        case 'development':
        default:
            app.use(express.errorHandler());
            console.log('dev setting set to development');
            return 'development';
    }
}


var group_session_auth = function ( err, req, res, next )
{
    if ( req.cookies.username == GLOBAL.group )
    {
        next(err);
    }
    else
    {
        res.clearCookie('username');
        res.redirect('/');
    }
}


var verify_login = function ( req, res )
{
    var username = req.body.username;
    var password = req.body.password;

    if ( username == GLOBAL.group &&
         password == GLOBAL.group_password )
    {
        res.cookie('username', username);
        res.redirect('/index');
    }
    else
    {
        errormessage = 'Incorrect Password';
        res.redirect('/');
    }
}


module.exports = {
    devenvironment: devenvironment,
    group_session_auth: group_session_auth,
    verify_login: verify_login
}


