//file for handling initialization shit

//parses the command line: grp=X for group name, npw=X for new pass word, etc.
//so node app.js grp=fuckface will set the group to fuckface; no group name setting defaults to 'default'
var parsecmd = function (term)
{
	var error = -1;
	var value;
	var i = 2;
	var tempstring;
	//var arguments = [];
	
	switch (term)
	{
		case 'groupname':
			var groupname = 'default';
			
			while (typeof(process.argv[i]) != 'undefined')
			{
			tempstring = process.argv[i];
			if (tempstring.search("grp") != -1)
				{
				groupname = tempstring.substring(4); //grp= is 0-3; 4 to end should be the group name
				error = 0;
				break;
				}
			i++;
			}
			return [error, groupname];
			
		default:
			return [error, 'error'];
	}
}

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
  devenvironment: devenvironment,
  parsecmd: parsecmd
}