// A tiny static server for the style guide (fonts don't load from file:// URLs). No dependencies.
//   npm run dev        then open http://localhost:4321
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const port = Number(process.env.PORT ?? 4321);
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.png': 'image/png',
	'.jpg': 'image/jpeg'
};

http
	.createServer((req, res) => {
		const url = new URL(req.url ?? '/', 'http://localhost');
		let file = path.join(root, decodeURIComponent(url.pathname));
		if (!file.startsWith(root)) return res.writeHead(403).end();
		if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
		fs.readFile(file, (err, body) => {
			if (err) return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
			res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
		});
	})
	.listen(port, () => console.log(`Postcard style guide on http://localhost:${port}`));
