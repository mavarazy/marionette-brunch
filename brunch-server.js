//var bodyParser = require('body-parser');
var http       = require('http');
var Path       = require('path');
var express    = require('express');
var httpProxy  = require('http-proxy');

// Our server start function
module.exports = function startServer(port, path, callback) {
    let app = express();

    var proxy = httpProxy.createProxyServer({
        target: {
            host: 'localhost',
            port: 7777
        }
    });
    proxy.on('error', (err, req, res) => {
        console.log(`ERROR: ${JSON.stringify(err)}`);
        res.status(500).send(err.msg);
    });

    app.all('/api/*', (request, response) => {
        proxy.proxyRequest(request, response);
    });

    app.use(express.static(Path.join(__dirname, path)));

    // Basic middlewares: static files, logs, form fields
    var server = http.createServer(app);

    // Listen on the right port, and notify Brunch once ready through `callback`.
    server.listen(port, callback);
};