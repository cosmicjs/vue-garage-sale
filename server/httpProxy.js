const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

//
// Create an HTTP proxy server with an HTTPS target
//
// run this script as sudo to be able to have access to port:80
// sudo node server/httpProxy.js
httpProxy.createProxyServer({
  target: 'https://localhost:5000',
  secure: false,
  changeOrigin: true
  // autoRewrite: true,
  // hostRewrite: true,
  // protocolRewrite: 'https'
}).listen({port: 80}, () =>
    console.log('Proxy:  http://localhost:5000 ---> https://localhost:5000')
);