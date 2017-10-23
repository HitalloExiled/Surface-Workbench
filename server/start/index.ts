import HTTP  = require('http');
import Path  = require('path');
import Utils               = require('./content/utils');
import ServerConfiguration = require('./server-configuration');

let config = new ServerConfiguration(Path.resolve(__dirname, '../'), require('../server.config.json'));

HTTP.createServer
(
    (request, response) =>
    {
        try
        {
            if (request.url)
            {
                let path = Utils.resolveUrl(config.wwwRoot, request.url, config.defaultRoute);

                path = path || config.notFound || '';
                Utils.loadFile(response, path);
            }
        }
        catch (error)
        {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end(error.message);
        }
    }
)
.listen(config.port);