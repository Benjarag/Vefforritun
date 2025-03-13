/* Write an HTTP server (in a file called httpServer.js) using Node.js (and in-built modules) that
listens to requests on IP 127.0.0.1, port 3000. More details are found in the lab description pdf file*/

const http = require('http');
const url = require('url');
const { stringifyDivision } = require('./math.js');

const server = http.createServer((req, res) => {
    // Parse the URL and query parameters
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const query = parsedUrl.query;
    
    // Handle routes based on path and method, similar to Express routing
    if (pathname === '/divide' && method === 'GET') {
        // Extract parameters from query - similar to req.params in Express
        const a = query.a;
        const b = query.b;
        
        // Validate parameters exist
        if (a !== undefined && b !== undefined) {
            // Convert to numbers and validate
            const numA = Number(a);
            const numB = Number(b);
            
            if (isNaN(a) || isNaN(b) || numB === 0 ) {
                res.writeHead(405, {'Content-Type': 'text/plain'});
                res.end('This operation is not supported.');
                return;
            }
            // Success response - similar to Express's res.status(200).send()
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(stringifyDivision(numA, numB));
        } else {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            res.end('This operation is not supported.');
        }
        
    } else {
        // Default handler for unsupported routes - similar to app.use('*') in Express
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('This operation is not supported.');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});