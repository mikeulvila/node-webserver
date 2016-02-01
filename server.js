'use strict'

const http = require('http');
const { PORT } = process.env;

http.createServer((req, res) => {
  console.log(req.method, req.url);

  debugger;

  res.writeHead(200, {
    "Content-type": "text/html"
  });


  res.end('<h1>Hello!!!</h1>');

}).listen(PORT, () => {
  console.log(`node.js server started. listening on port ${PORT}`);
});
