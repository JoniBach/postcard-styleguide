// Builds dist/: postcard.css (every @import inlined, one file), postcard.min.css, the fonts beside
// them, the helpers, and tokens.json (every token per theme, resolved, for platforms without CSS
// custom properties: Tailwind config, native apps, design tools). No dependencies.
//   npm run build
import fs from 'node:fs';
import path from 'node:path';
import { readTokens } from './tokens.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'fonts'), { recursive: true });

/** inline @imports; a file's own url()s are rewritten before its imports go in, so none is rewritten twice */
function bundle(file) {
	const dir = path.dirname(file);
	return fs
		.readFileSync(file, 'utf8')
		.replace(/url\(['"]?([^'")]+)['"]?\)/g, (m, rel) => {
			if (/^(data:|https?:|#)/.test(rel)) return m;
			const abs = path.join(dir, rel);
			// the fonts are copied to dist/fonts
			if (path.dirname(abs) === path.join(root, 'fonts')) return `url('./fonts/${path.basename(abs)}')`;
			return `url('${path.relative(dist, abs).replace(/\\/g, '/')}')`;
		})
		.replace(/@import\s+['"]([^'"]+)['"];/g, (_, rel) => bundle(path.join(dir, rel)));
}
const full = bundle(path.join(root, 'postcard.css'));
fs.writeFileSync(path.join(dist, 'postcard.css'), full);

// a light minify: comments and runs of whitespace; nothing clever
const min = full
	.replace(/\/\*[\s\S]*?\*\//g, '')
	.replace(/\s+/g, ' ')
	.replace(/\s*([{}:;,>])\s*/g, '$1')
	.replace(/;}/g, '}')
	.trim();
fs.writeFileSync(path.join(dist, 'postcard.min.css'), min);

for (const f of fs.readdirSync(path.join(root, 'fonts'))) fs.copyFileSync(path.join(root, 'fonts', f), path.join(dist, 'fonts', f));
fs.copyFileSync(path.join(root, 'js', 'postcard.js'), path.join(dist, 'postcard.js'));

const { light, dusk, night } = readTokens();
const strip = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/^--pc-/, ''), v]));
fs.writeFileSync(
	path.join(dist, 'tokens.json'),
	JSON.stringify({ $description: 'Postcard design tokens, resolved per theme (from css/tokens.css)', light: strip(light), dusk: strip(dusk), night: strip(night) }, null, '\t') + '\n'
);

const kb = (f) => `${(fs.statSync(path.join(dist, f)).size / 1024).toFixed(1)} kB`;
console.log(`dist/postcard.css ${kb('postcard.css')}, postcard.min.css ${kb('postcard.min.css')}, tokens.json ${kb('tokens.json')}`);
