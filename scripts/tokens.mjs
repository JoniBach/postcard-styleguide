// Reads css/tokens.css (the source of truth) into plain objects, one per theme, with every var()
// reference resolved. Shared by the build (dist/tokens.json) and the contrast check.
import fs from 'node:fs';

const SOURCE = new URL('../css/tokens.css', import.meta.url);

/** the declarations inside the first block that starts at `selector` */
function block(css, selector) {
	const at = css.indexOf(selector);
	if (at < 0) throw new Error(`tokens.css has no block for ${selector}`);
	let i = css.indexOf('{', at);
	// a media query wraps its rule: skip to the inner block
	if (selector.startsWith('@media')) i = css.indexOf('{', i + 1);
	const start = i + 1;
	let depth = 1;
	while (depth && ++i < css.length) depth += css[i] === '{' ? 1 : css[i] === '}' ? -1 : 0;
	return css.slice(start, i);
}

function declarations(body) {
	const out = {};
	const clean = body.replace(/\/\*[\s\S]*?\*\//g, '');
	for (const m of clean.matchAll(/(--pc-[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim().replace(/\s+/g, ' ');
	return out;
}

function resolve(vars) {
	const seen = {};
	const get = (name, depth = 0) => {
		if (depth > 20) throw new Error(`var() loop at ${name}`);
		const v = vars[name];
		if (v === undefined) return undefined;
		return v.replace(/var\((--pc-[\w-]+)(?:,\s*([^)]+))?\)/g, (_, ref, fallback) => get(ref, depth + 1) ?? fallback ?? '');
	};
	for (const k of Object.keys(vars)) seen[k] = get(k);
	return seen;
}

/** { light, dusk, night, duskBlocksMatch } — each theme a full map of --pc-* to resolved values */
export function readTokens() {
	const css = fs.readFileSync(SOURCE, 'utf8');
	const light = declarations(block(css, ':root {'));
	const duskMedia = declarations(block(css, '@media (prefers-color-scheme: dark)'));
	const duskPinned = declarations(block(css, ":root[data-theme='dusk']"));
	const night = declarations(block(css, '.pc-theme-night {'));
	const duskBlocksMatch = JSON.stringify(duskMedia) === JSON.stringify(duskPinned);
	return {
		light: resolve(light),
		dusk: resolve({ ...light, ...duskPinned }),
		night: resolve({ ...light, ...night }),
		duskBlocksMatch,
		raw: { light, dusk: duskPinned, night }
	};
}
