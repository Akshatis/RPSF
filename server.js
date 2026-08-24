/** Minimal dependency-free static server for the TTMS POC. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  const safePath = decodeURIComponent((req.url || '/').split('?')[0]).replace(/\\/g,'/');
  const file = path.resolve(root, '.' + (safePath === '/' ? '/index.html' : safePath));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(err.code === 'ENOENT' ? 404 : 500); return res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error'); }
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY',
      'Referrer-Policy':'strict-origin-when-cross-origin',
      'Cache-Control':'no-store'
    });
    res.end(body);
  });
}).listen(port, '0.0.0.0', () => console.log(`RPSF TTMS POC is running on http://0.0.0.0:${port}`));
