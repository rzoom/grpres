
# Function that is called when a request arrives.
reply = (request, response) ->
  response.writeHead 200,
    "Content-Type": "text/plain"

  response.write "Hello there, World"
  response.end()


http = require("http")

http.createServer(reply).listen 8888

