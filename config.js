//file for handling initialization shit

//load the app using NODE_ENV=<production or development> node app.js in linux; set NODE_ENV in the console, then execute node app.js in windows
var devenvironment = function (app, express) 
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

module.exports = {
  devenvironment: devenvironment
}

