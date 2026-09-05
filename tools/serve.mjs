// Static file server for local viewing. No dependencies, no build step —
// the page deployed to GitHub Pages is these exact files, served the same way.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { extname, join, resolve, sep } from 'node:path';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2]) || 8117;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
};

createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  // Resolve inside ROOT and then confirm it stayed there, rather than trying to
  // strip traversal sequences by pattern — a filter is a guess, a containment
  // check is a fact.
  const file = resolve(join(ROOT, p));
  if (file !== ROOT && !file.startsWith(ROOT + sep)) {
    res.writeHead(403, { 'content-type': 'text/plain' });
    return res.end('403');
  }
  try {
    const buf = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404 ' + p);
  }
}).listen(PORT, () => console.log(`serving ${ROOT} at http://localhost:${PORT}/`));
