const fs = require('fs');
const http2 = require('http2');
  var options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem')
  };
const server = http2.createSecureServer(options);
//server.on('error', (err) => console.error(err));
server.on('stream', (stream, requestHeaders) => {
    stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});
server.listen(443);
