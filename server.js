'use strict'

const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  console.log(req.method, req.url);
  if (req.url === '/hello') {
    const msg = '<h1>Hello World!</h1>';

    res.writeHead(200, {
      'Content-type': 'tex/html'
    });

    msg.split('').forEach((char, i) => {
      setTimeout(() => {
        res.write(char);
      }, 1000*i);
    });
    setTimeout(() => {
      res.end();
    }, 20000);
  } else if (req.url === '/random') {
    res.end(Math.random().toString());
  } else {
    res.writeHead(403);
    res.end('Access Denied');
  }
  res.writeHead(200, {
    "Content-type": "text/html"
  });


}).listen(PORT, () => {
  console.log(`node.js server started. listening on port ${PORT}`);
});
