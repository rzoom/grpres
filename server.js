

var reply = function(request, response) {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    response.write("Hello there, World");
    return response.end();
};

var http = require("http");

http.createServer(reply).listen(8888);

